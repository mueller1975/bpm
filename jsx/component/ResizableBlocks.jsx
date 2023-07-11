import { Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useRef, useMemo, useCallback, useImperativeHandle } from 'react';

const MIN_BLOCK_HEIGHT = 5; // 區塊最小高度
const MIN_BLOCK_WIDTH = 5; // 區塊最小寬度
const MIN_AUTO_RESIZE_FLEX = 0.1 // 自動展開區塊至平均大小的原來區塊最小 flex-grow 值
const BLOCK_TRANSITION_STYLE = 'all .3s ease-in-out'; // 區塊 transition 效果

/**
 * 可調大小區塊元件
 */
const ResizableBlock = React.memo(styled(React.forwardRef(({ className, collapsed, ...others }, ref) =>
    <Paper square ref={ref} className={`${className} resizable-block`} {...others} />
))`
    width: 100%;
    height: 100%;
    // flex: 1 1 0%;
    // flex-grow: ${({ collapsed }) => collapsed ? 0 : 1}; // 每一區塊預設尺寸皆相同
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0%;
    overflow: auto;
    min-width: ${MIN_BLOCK_WIDTH}px;
    min-height: ${MIN_BLOCK_HEIGHT}px;
    transition: ${BLOCK_TRANSITION_STYLE};
`);

/**
 * 可調大小區塊 splitter 元件
 */
const Splitter = styled(({ className, resizable, orientation, ...others }) => <div className={`${className} resizable-splitter`} {...others} />)`
    z-index: 99;
    width: ${({ orientation }) => orientation == 'horizontal' ? '10px' : '2px'};
    height: ${({ orientation }) => orientation == 'horizontal' ? '2px' : '10px'};
    position: relative;
    border-radius: 1px;
    transform: scale(5,5);
    user-select: none;
    border: 0;
    background-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '#9dde93' : '#d8a924'};
    cursor: ${({ orientation }) => orientation == 'horizontal' ? 'ns-resize' : 'ew-resize'};
`;

/**
 * 可調大小區塊容器元件
 */
export default React.memo(styled(React.forwardRef((props, ref) => {
    const { className, orientation, collapsedBlocks = [], resizable = false, children } = props;
    const blockRefs = useRef([]); // 儲存每一 Block DOM
    const mouseDownInfo = useRef(); // 儲存 mouse down 時的 Splitter、前後區塊相關資訊

    /* expose functions to parent component */
    useImperativeHandle(ref, () => ({
        expandBlockBackward, // 往前一區塊自動展開 Block
        expandBlockForward, // 往後一區塊自動展開 Block
    }))

    /**
     * 往前一區塊自動展開 Block
     * @param {*} blockIdx 
     */
    const expandBlockBackward = blockIdx => {
        let targetIdx = blockIdx - 1;

        if (targetIdx < 0) {
            console.error("已是最前區塊, 無法往前自動展開!");
        } else {
            let block = blockRefs.current[blockIdx];
            let targetBlock = blockRefs.current[targetIdx];

            if (block.style.flexGrow < MIN_AUTO_RESIZE_FLEX) {
                autoResizeBlocks(targetBlock, block);
            }
        }
    }

    /**
     * 往後一區塊自動展開 Block
     * @param {*} blockIdx 
     */
    const expandBlockForward = blockIdx => {
        let targetIdx = blockIdx + 1;

        if (targetIdx > blockRefs.current.length - 2) {
            console.error("已是最後區塊, 無法往後自動展開!");
        } else {
            autoResizeBlocks(blockRefs.current[blockIdx], blockRefs.current[targetIdx]);
        }
    };

    /**
     * Splitter 的 mouse-down event handler (開始 block resizing)
     * @param {*} e 
     */
    const mouseDownHandler = useCallback(e => {
        e.stopPropagation(); // 防止頁面左右滑動

        // Splitter
        const splitter = e.target; // DOM
        const splitterX = e.pageX; // 目前位置 X
        const splitterY = e.pageY; // 目前位置 Y

        // 前區塊
        const prevBlock = splitter.previousElementSibling; // DOM
        const prevBlockWidth = prevBlock.offsetWidth; // 寬度
        const prevBlockHeight = prevBlock.offsetHeight; // 長度
        const prevBlockFlex = prevBlock.style.flexGrow ? parseFloat(prevBlock.style.flexGrow) : 1.0; // flex-grow 值
        prevBlock.style.transition = 'none'; // 先將 transition 效果移除, 防止 resize 時有延遲現象

        // 後區塊
        const nextBlock = splitter.nextElementSibling; // DOM
        const nextBlockWidth = nextBlock.offsetWidth; // 寬度
        const nextBlockHeight = nextBlock.offsetHeight; // 長度
        const nextBlockFlex = nextBlock.style.flexGrow ? parseFloat(nextBlock.style.flexGrow) : 1.0; // flex-grow 值
        nextBlock.style.transition = 'none'; // 先將 transition 效果移除, 防止 resize 時有延遲現象

        // 儲存 Splitter、前後區塊相關資訊
        mouseDownInfo.current = {
            lastOffset: 0, splitter, splitterX, splitterY, prevBlock, prevBlockWidth, prevBlockHeight, prevBlockFlex,
            nextBlock, nextBlockWidth, nextBlockHeight, nextBlockFlex
        };
    }, []);

    /**
     * Block Container 的 mouse-move event handler (調整 block 大小)
     * @param {*} e 
     * @returns 
     */
    const mouseMoveHandler = useCallback(e => {
        // 點擊到 Splitter 才處理
        if (mouseDownInfo.current != undefined) {
            const { lastOffset, splitterX, splitterY, prevBlock, prevBlockWidth, prevBlockHeight, prevBlockFlex,
                nextBlock, nextBlockWidth, nextBlockHeight, nextBlockFlex } = mouseDownInfo.current;

            let offset; // 目前滑鼠與點擊的 Splitter 之間距離

            if (orientation == 'horizontal') { // 調整上下區塊高度
                offset = e.pageY - splitterY;

                // 滑鼠未移動時不處理
                if (offset == lastOffset) {
                    return;
                }

                let height = prevBlockHeight + offset; // 計算前區塊在滑鼠移動後應調整的高度

                // 控制 offset 值使調整後的前區塊高度不得小於(預設區塊最小值)及大於(前後區塊高度和-預設區塊最小值)
                if (height < MIN_BLOCK_HEIGHT) {
                    offset = -prevBlockHeight + MIN_BLOCK_HEIGHT;
                } else if (height > prevBlockHeight + nextBlockHeight - MIN_BLOCK_HEIGHT) {
                    offset = nextBlockHeight - MIN_BLOCK_HEIGHT;
                }

                // 根據調整後前後區塊的高度計算前後區塊的 flex-grow 值
                let flexGrowSum = prevBlockFlex + nextBlockFlex; // 前後區 flex-grow 值的和
                let prevFlexGrow = flexGrowSum * (prevBlockHeight + offset) / (prevBlockHeight + nextBlockHeight); // 前區塊 flex-grow 值
                let nextFlexGrow = flexGrowSum - prevFlexGrow; // 後區塊 flex-grow 值

                // 指定前後區塊的 flex-grow 值
                prevBlock.style.flexGrow = prevFlexGrow;
                nextBlock.style.flexGrow = nextFlexGrow;
            } else { // 調整左右區塊寬度
                let offset = e.pageX - splitterX;

                // 滑鼠未移動時不處理
                if (offset == lastOffset) {
                    return;
                }

                let width = prevBlockWidth + offset; // 計算前區塊在滑鼠移動後應調整的寬度

                // 控制 offset 值使調整後的前區塊高度不得小於(預設區塊最小值)及大於(前後區塊高度和-預設區塊最小值)
                if (width < MIN_BLOCK_WIDTH) {
                    offset = -prevBlockWidth + MIN_BLOCK_WIDTH;
                } else if (width > prevBlockWidth + nextBlockWidth - MIN_BLOCK_WIDTH) {
                    offset = nextBlockWidth - MIN_BLOCK_WIDTH;
                }

                // 根據調整後前後區塊的寬度計算前後區塊的 flex-grow 值
                let flexGrowSum = prevBlockFlex + nextBlockFlex; // 前後區 flex-grow 值的和
                let prevFlexGrow = flexGrowSum * (prevBlockWidth + offset) / (prevBlockWidth + nextBlockWidth); // 前區塊 flex-grow 值
                let nextFlexGrow = flexGrowSum - prevFlexGrow; // 後區塊 flex-grow 值

                // 指定前後區塊的 flex-grow 值
                prevBlock.style.flexGrow = prevFlexGrow;
                nextBlock.style.flexGrow = nextFlexGrow;
            }

            mouseDownInfo.current.lastOffset = offset; // 儲存目前 offset
        }
    }, [orientation]);

    /**
     * Container 的 mouse-up 及 mouse-leave 的 event handler (結束 block resizing)
     * @param {*} e
     */
    const mouseUpHandler = useCallback(e => {
        if (mouseDownInfo.current) {
            const { prevBlock, nextBlock } = mouseDownInfo.current;

            // 將 transition 效果加回前後區塊
            prevBlock.style.transition = BLOCK_TRANSITION_STYLE;
            nextBlock.style.transition = BLOCK_TRANSITION_STYLE;

            mouseDownInfo.current = undefined; // 結束 resize 動作
        }
    }, []);

    /**
     * Splitter double-click event handler (區塊自動 resize)
     * @param {*} e 
     */
    const doubleClickHandler = useCallback(e => {
        const prevBlock = e.target.previousElementSibling; // 前區塊
        const nextBlock = e.target.nextElementSibling; // 後區塊

        autoResizeBlocks(prevBlock, nextBlock);
    }, []);

    // 將所有子元件以 ResizableBlock 元件包覆 (若只有一個子元件則不須包覆)
    const elements = useMemo(() => {
        if (!Array.isArray(children)) { // 只有一個子元件
            return children;
        } else {
            /* 計算每個 block flex-grow 值 */
            let blockFlexGrows = new Array(children.length).fill(1.0); // 預設每 blcok flex-grow 值為 1.0

            // block 順序由後至前開始指定 flex-grow 值 (排除第一個 block)
            for (let idx = blockFlexGrows.length - 1; idx > 0; idx--) {
                // 指定 collapsed block flex-grow 值為 0, 並將其原來的 flex-grow 值加到前一區塊
                if (collapsedBlocks.indexOf(idx) > -1) {
                    blockFlexGrows[idx - 1] += blockFlexGrows[idx];
                    blockFlexGrows[idx] = 0;
                }
            }

            // 處理第一個 block flex-grow 值
            if (collapsedBlocks.indexOf(0) > -1) {
                // 若第一個 block 被指定為 collapsed, 往後找尋第一個非 collapsed 的 block, 若尋得即將其 flex-grow 值加到此區塊
                for (let idx = 1; idx < blockFlexGrows.length; idx++) {
                    if (blockFlexGrows[idx] > 0) {
                        blockFlexGrows[idx] += blockFlexGrows[0];
                        blockFlexGrows[0] = 0;
                        break;
                    }
                }
            }

            // console.log({ blockFlexGrows })

            return children.reduce((prev, child, index) => {
                let element = [
                    <ResizableBlock key={index}
                        ref={
                            elm => {
                                if (elm && elm.style.flexGrow == '') {
                                    elm.style.flexGrow = blockFlexGrows[index]; // 指定 block flex-grow 值
                                }

                                blockRefs.current[index] = elm;
                            }}>{child}</ResizableBlock>
                ];

                // 若非最後 block, 加上 Splitter 元件
                if (index < children.length - 1) {
                    element.push(<Splitter key={`splitter-${index}`} orientation={orientation} resizable={resizable}
                        onMouseDown={mouseDownHandler} onTouchStart={mouseDownHandler} onDoubleClick={doubleClickHandler} />);
                }

                return prev.concat(element);
            }, []);
        }
    }, [orientation, resizable, children, mouseMoveHandler]);

    return (
        <div ref={ref} className={`${className} resizable-container`} onMouseMove={mouseMoveHandler} onMouseUp={mouseUpHandler} onMouseLeave={mouseUpHandler}
            onTouchMove={mouseMoveHandler} onTouchEnd={mouseUpHandler}>
            {elements}
        </div>
    );
}))`
    height: 100%;
    display: flex;
    flex-direction: ${({ orientation }) => orientation == 'horizontal' ? 'column' : 'row'};
    justify-content: center;
    align-items: center;
    background-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '#d3f2f7' : '#604d14'};
`);

/**
 * 自動 resize 兩區塊
 * @param {*} prevBlock 
 * @param {*} nextBlock 
 */
const autoResizeBlocks = (prevBlock, nextBlock) => {
    let prevFlexGrow = prevBlock.style.flexGrow ? parseFloat(prevBlock.style.flexGrow) : 1.0; // 前區塊 flex-grow 值
    let nextFlexGrow = nextBlock.style.flexGrow ? parseFloat(nextBlock.style.flexGrow) : 1.0; // 後區塊 flex-grow 值
    let flexGrowSum = prevFlexGrow + nextFlexGrow; // 前後區塊 flex-grow 值和

    // console.log('before:', { prevFlexGrow, nextFlexGrow });

    if (prevFlexGrow < MIN_AUTO_RESIZE_FLEX || nextFlexGrow < MIN_AUTO_RESIZE_FLEX) { // 當前後區塊有任一 flex-grow < MIN_AUTO_RESIZE_FLEX 時, resize 至兩區塊相同尺寸
        prevFlexGrow = flexGrowSum / 2;
        nextFlexGrow = flexGrowSum - prevFlexGrow;
    } else if (prevFlexGrow < nextFlexGrow) { // 當後區塊尺寸 > 前區塊時, 將後區塊 resize 至最大 (前後區塊 flex-grow 值和)
        prevFlexGrow = 0;
        nextFlexGrow = flexGrowSum;
    } else { // 當前區塊尺寸 >= 後區塊時, 將前區塊 resize 至最大 (前後區塊 flex-grow 值和)
        prevFlexGrow = flexGrowSum;
        nextFlexGrow = 0;
    }

    // 指定前後區塊的 flex-grow 值
    prevBlock.style.flexGrow = prevFlexGrow;
    nextBlock.style.flexGrow = nextFlexGrow;

    // console.log('after:', { prevFlexGrow, nextFlexGrow });
};