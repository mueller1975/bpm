/**
 * 公司部門選取 Dialog
 */
import AddIcon from '@mui/icons-material/Add';
import CachedIcon from '@mui/icons-material/Cached';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import {
    Box, Button, DialogActions, DialogContent, Divider, Grid, IconButton,
    InputAdornment, List, ListItem, ListItemSecondaryAction, ListItemText, MenuItem,
    Paper, TextField, Toolbar, Typography, Zoom
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { SpringTransition2 } from 'Animations';
import { getBUList, getOUList } from 'API/WebAPI.jsx';
import { ConfirmDialog, RemoteDataTable, DraggableDialog, IconnedDialogTitle } from 'Components';
import { CSRF_HEADER, CSRF_TOKEN } from 'Config';
import { useNotification } from 'Hook/useTools.jsx';
import React from 'react';

const tableHeaders = [
    { prop: "costNo", name: "部門代號", width: 110 },
    { prop: "costName", name: "部門名稱", width: 250, noWrap: true },
    { prop: "bu", name: "事業部/中心", width: 150, noWrap: true },
    { prop: "ou", name: "處級單位", width: 250, noWrap: true },
]

const defaultState = {
    selectedUnits: [],
    selectedRows: [],
    groupName: '',
    errorSaveGroup: '',
    groupList: [],
    selectedGroup: { id: '', name: '' },

    fullScreen: false,

    filterBtnEl: null,
    buFilter: '',
    ouFilter: '',
    buList: [],
    ouList: [],

    filterParams: '',

    confirmDialog: { open: false },
}

class DepartmentDialog extends React.Component {

    constructor(props) {
        super(props)

        this.deptTableRef = React.createRef()
        this.selectedGroup = null
        this.state = defaultState

        this.adjustDialogSize = this.adjustDialogSize.bind(this)
        this.fetchGroupList = this.fetchGroupList.bind(this)
        this.rowSelectedHandler = this.rowSelectedHandler.bind(this)
        this.doubleClickRowHandler = this.doubleClickRowHandler.bind(this)
        this.addSelectedRowsToList = this.addSelectedRowsToList.bind(this)
        this.addToList = this.addToList.bind(this)
        this.deleteListItem = this.deleteListItem.bind(this)
        this.onConfirm = this.onConfirm.bind(this)
        this.onClose = this.onClose.bind(this)
        this.groupNameChangeHandler = this.groupNameChangeHandler.bind(this)
        this.selectGroup = this.selectGroup.bind(this)
        this.replaceUnits = this.replaceUnits.bind(this)
        this.appendUnits = this.appendUnits.bind(this)
        this.cancelConfirmDialog = this.cancelConfirmDialog.bind(this)
        this.saveGroup = this.saveGroup.bind(this)
        this.clearFilters = this.clearFilters.bind(this)
        this.buFilterChangedHandler = this.buFilterChangedHandler.bind(this)
        this.ouFilterChangedHandler = this.ouFilterChangedHandler.bind(this)

        window.addEventListener("resize", this.adjustDialogSize)
    }

    componentDidMount() {
        this.fetchGroupList() // 取得個人部門群組設定

        getBUList().then(buList => {
            this.setState({ buList })
        }).catch(error => {
            this.props.showError(error.message)
        })

        //window.dispatchEvent( new Event( "resize" ) ) // for non-IE
        var resizeEvent = window.document.createEvent('UIEvents');
        resizeEvent.initUIEvent('resize', true, false, window, 0);
        window.dispatchEvent(resizeEvent);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.adjustDialogSize, false)
    }

    adjustDialogSize(e) {
        const fullScreen = e.currentTarget.innerWidth < 1200 || e.currentTarget.innerHeight < 800
        this.setState({ fullScreen })
    }

    fetchGroupList() {
        // fetch user groups
        fetch('service/app/unitgroup/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                [CSRF_HEADER]: CSRF_TOKEN
            }
        }).then(response => {
            if (response.ok) {
                response.json().then(vo => {

                    if (vo.code == 0) { // success
                        this.setState({ groupList: vo.data });
                    } else { // error
                        console.log(response)
                        this.props.showError("部門群組查詢失敗!")
                    }
                }).catch(error => {
                    console.log(error)
                    this.props.showError(error.message)
                });
            } else {
                console.log("Not OK!")
                console.log(response)
                this.props.showError(response)
            }
        }).catch(error => {
            this.props.showError(error.message)
        }); // fetch()
    }// fetchGroupList()

    rowSelectedHandler(selectedRows) {
        this.setState({ selectedRows })
    }

    doubleClickRowHandler(row) {
        this.addToList([row])
    }

    addSelectedRowsToList() {
        this.addToList(this.state.selectedRows)
    }

    addToList(unitsToAdd) {

        let existedUnits = this.state.selectedUnits
        let units = unitsToAdd

        if (existedUnits.length > 0) {
            let newUnits = unitsToAdd.filter(unit => {
                let duplicatedUnit = existedUnits.find(u => u.costNo === unit.costNo)
                return duplicatedUnit == null
            })

            units = existedUnits.concat(newUnits)
        }

        this.setState({ selectedUnits: units })
    }

    deleteListItem(item) {
        let selectedUnits = this.state.selectedUnits.filter(unit => unit.costNo != item.costNo)
        this.setState({ selectedUnits })
    }

    /* 確認新增 */
    onConfirm() {
        if (this.state.selectedUnits.length == 0) {
            this.props.showWarning("您尚未選取任何部門！")
        } else {
            this.props.onConfirm(this.state.selectedUnits)
            this.onClose()
        }
    }

    onClose() {
        // this.setState(defaultState) // 不清空全部狀態
        this.setState({ selectedUnits: [], selectedGroup: { id: '', name: '' }, groupName: '', errorSaveGroup: '' }) // 清空選取部門列表相關狀態
        this.props.onClose()
    }

    groupNameChangeHandler(e) {
        const groupName = e.target.value
        this.setState({ groupName })
    }

    /* 選取群組 */
    selectGroup(e) {
        let id = e.target.value;

        if (id === '') {
            return
        }

        let selectedGroup = this.state.groupList.find(group => group.id === id)

        if (this.state.selectedUnits.length == 0) {
            this.setState({ selectedGroup, selectedUnits: selectedGroup.units, groupName: selectedGroup.name, errorSaveGroup: '' })
        } else {
            this.selectedGroup = selectedGroup
            let confirmDialog = { open: true, title: "取代或加入確認", content: `您要將「${selectedGroup.name}」群組中的部門取代或加入已選取的部門列表中？`, severity: "warn" }

            this.setState({ confirmDialog })
        }
    }

    /* 群組成員取代已選取成員 */
    replaceUnits() {
        const selectedGroup = this.selectedGroup
        this.setState({ selectedGroup, selectedUnits: selectedGroup.units, groupName: selectedGroup.name, confirmDialog: { ...this.state.confirmDialog, open: false } })
    }

    /* 群組成員加入已選取成員 */
    appendUnits() {
        const selectedGroup = this.selectedGroup

        this.addToList(selectedGroup.units)
        this.setState({ selectedGroup, groupName: selectedGroup.name, confirmDialog: { ...this.state.confirmDialog, open: false } })
    }

    /* 取消群組選取 */
    cancelConfirmDialog() {
        let { confirmDialog } = this.state
        confirmDialog.open = false
        this.setState({ confirmDialog })
    }

    saveGroup() {
        const { dispatch } = this.props
        let { groupName } = this.state

        groupName = groupName.trim()

        if (groupName == '') {
            this.setState({ groupName, errorSaveGroup: "請輸入群組名稱" })
        } else if (this.state.selectedUnits.length == 0) {
            this.setState({ errorSaveGroup: "請先選取部門至列表中" })
        } else {
            let deptIds = this.state.selectedUnits.map(unit => unit.costNo);
            let params = { groupName, deptIds }

            fetch('service/app/unitgroup/save', {
                body: JSON.stringify(params),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    [CSRF_HEADER]: CSRF_TOKEN
                }
            }).then(response => {
                if (response.ok) {
                    response.json().then(vo => {

                        if (vo.code == 0) { // success
                            this.setState({ errorSaveGroup: '' }, () => this.fetchGroupList())
                            this.props.showSuccess("部門群組儲存成功!")
                        } else { // error
                            console.log(response)
                            this.props.showError("部門群組儲存失敗!")
                        }
                    }).catch(error => {
                        console.log(error)
                        this.props.showError(error)
                    });
                } else {
                    console.log("Not OK!")
                    console.log(response)
                    this.props.showError(response)
                }
            }).catch(error => {
                this.props.showError(error)
            }); // fetch()
        }
    }

    /* 清空過濾欄位 */
    clearFilters() {
        this.setState({ buFilter: '', ouFilter: '', ouList: [], filterParams: '' })
    }

    /* BU 過濾條件更動時 */
    buFilterChangedHandler(e) {
        const buFilter = e.target.value

        if (this.state.buFilter !== buFilter) {
            const filterParams = buFilter ? { bu: buFilter } : ''

            this.setState({ buFilter, ouFilter: '', ouList: [], filterParams }, () => {

                getOUList(buFilter).then(ouList => {
                    this.setState({ ouList })
                }).catch(error => {
                    this.props.showError(error.message)
                })
            })
        }
    }

    /* OU 過濾條件更動時 */
    ouFilterChangedHandler(e) {
        const ouFilter = e.target.value
        const filterParams = { ...this.state.filterParams, ou: ouFilter }

        if (this.state.ouFilter !== ouFilter) {
            this.setState({ ouFilter, filterParams }, () => {
            })
        }
    }

    render() {
        const { className } = this.props
        const { fullScreen, buFilter, ouFilter, buList, ouList, confirmDialog, selectedRows, filterParams } = this.state

        const filter = (
            <Box width={300}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField name="buFilter" select fullWidth label="事業部/中心" margin="dense" value={buFilter} onChange={this.buFilterChangedHandler}>
                            <MenuItem value=""><em>清空此欄</em></MenuItem>
                            {buList.map((bu, index) =>
                                <MenuItem key={index} value={bu}>{bu === '.' ? '無' : bu}</MenuItem>
                            )}
                        </TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField name="ouFilter" select fullWidth label="處級單位" margin="dense" disabled={buFilter === ''} value={ouFilter} onChange={this.ouFilterChangedHandler}>
                            <MenuItem value=""><em>清空此欄</em></MenuItem>
                            {ouList.map((ou, index) =>
                                <MenuItem key={index} value={ou}>{ou === '.' ? '無' : ou}</MenuItem>
                            )}
                        </TextField>
                    </Grid>
                </Grid>

                <Toolbar disableGutters className="filterToolbar">
                    <Button fullWidth variant="contained" onClick={this.clearFilters} disabled={!buFilter && !ouFilter}>
                        <Typography variant="body1">清空所有欄位</Typography>
                    </Button>
                </Toolbar>
            </Box>
        )

        return (
            <React.Fragment>
                {/* 詢問取代或加入 Dialog */}
                <ConfirmDialog open={confirmDialog.open} title={confirmDialog.title} content={confirmDialog.content} severity={confirmDialog.severity}
                    actionButtons={[
                        <Button key="cancel" variant="contained" onClick={this.cancelConfirmDialog} startIcon={<ClearIcon />}>取消</Button>,
                        <Button key="replace" variant="contained" color="warning" onClick={this.replaceUnits} startIcon={<CachedIcon />}>取代</Button>,
                        <Button key="append" variant="contained" color="secondary" onClick={this.appendUnits} startIcon={<AddIcon />}>加入</Button>
                    ]}
                />

                <DraggableDialog maxWidth={fullScreen ? false : 'lg'} fullScreen={fullScreen} open={this.props.open} classes={{ paper: 'dialogPaper' }}
                    TransitionComponent={Zoom}>

                    <IconnedDialogTitle icon={AddIcon} title={this.props.title}>
                        <Button variant="contained" startIcon={<ClearIcon />} onClick={this.onClose}>取消</Button>
                        <Button variant="contained" color="secondary" startIcon={<CheckIcon />} onClick={this.onConfirm}
                            disabled={this.state.selectedUnits == 0}>確定</Button>
                    </IconnedDialogTitle>

                    <DialogContent className="dialogContent">
                        <Grid container spacing={2} className="dialogContainer">

                            {/* Table Grid */}
                            <Grid item className="tableGrid">
                                <Paper className="tablePaper">
                                    <RemoteDataTable ref={this.deptTableRef} showCheckbox enableKeywordSearch resizable storageKey="department"
                                        options={{
                                            title: "部門清單", columns: tableHeaders, size: 15, sizeOptions: [15, 25, 50, 75],
                                            serviceUrl: "service/app/department/list"
                                        }}
                                        // onFilter={this.openFilter}
                                        toolbarClassName="tableToolbar" onChangeTable={this.tableChangedHandler}
                                        onSelectRow={this.rowSelectedHandler} onDoubleClickRow={this.doubleClickRowHandler}
                                        filter={filter} filterParams={filterParams}

                                        actionButtons={[
                                            { action: this.addSelectedRowsToList, icon: PlaylistAddIcon, tooltip: '選取至列表', color: 'warning', disabled: selectedRows.length == 0 }
                                        ]} />
                                </Paper>
                            </Grid>

                            {/* Selected List Grid */}
                            <Grid item className="listGrid">
                                <Paper className="selectedGridPaper">
                                    <Typography variant="subtitle1" className="selectGroupHeader"><PlaylistAddCheckIcon sx={{ mr: .5 }} />已選取部門 ( {this.state.selectedUnits.length} )</Typography>
                                    <Divider />

                                    {/* 部門群組下拉選單 */}
                                    <div className="groupWrapper">
                                        <TextField margin="normal" select fullWidth variant="outlined" label="選擇部門群組"
                                            value={this.state.selectedGroup.id} onChange={this.selectGroup}>

                                            {this.state.groupList.length == 0 &&
                                                <MenuItem value="">您尚未儲存任何群組</MenuItem>
                                            }
                                            {this.state.groupList.map((group, index) =>
                                                <MenuItem key={index} value={group.id}>{group.name}</MenuItem>)
                                            }
                                        </TextField>
                                    </div>

                                    {/* 已選取部門清單 */}
                                    <div className="selectedListWrapper">
                                        <List dense>
                                            <SpringTransition2 variant="effect" trail={100} items={this.state.selectedUnits} keys={unit => unit.costNo}>
                                                {
                                                    unit =>
                                                        <ListItem dense className="selectedListItem" classes={{ container: 'selectedListItemContainer' }}
                                                            disableGutters>
                                                            <ListItemText primary={unit.costName} secondary={unit.costNo} />
                                                            <ListItemSecondaryAction>
                                                                <IconButton onClick={e => { this.deleteListItem(unit) }}><DeleteIcon /></IconButton>
                                                            </ListItemSecondaryAction>
                                                        </ListItem>
                                                }
                                            </SpringTransition2>
                                        </List>
                                    </div>

                                    <div className="groupWrapper">
                                        <TextField fullWidth margin="normal" variant="outlined" label="部門群組名稱" placeholder="輸入欲儲存群組名稱"
                                            error={this.state.errorSaveGroup !== ''} onChange={this.groupNameChangeHandler} value={this.state.groupName}
                                            helperText={this.state.errorSaveGroup}
                                            InputProps={{
                                                classes: { root: 'saveGroupInputRoot', notchedOutline: 'saveGroupInputOutline' },
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={this.saveGroup}>
                                                            <SaveAltIcon />
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }} />
                                    </div>

                                </Paper>
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions />
                </DraggableDialog>
            </React.Fragment>
        ); // return
    } // render()
} // DepartmentDialog

export default React.memo(styled(props => {
    const { showSuccess, showInfo, showWarning, showError } = useNotification()

    return <DepartmentDialog {...props} showSuccess={showSuccess} showInfo={showInfo} showWarning={showWarning} showError={showError} />
})`
    .tablePaper {
        min-height: calc(100vh - 250px);
        overflow: auto;
        height: 100%;
        width: 100%;
    }
    
    .tableToolbar {
        background-color: #235050;
    }

    .dialogPaper {
        background-color: rgba(9, 63, 72, 0.85);
        min-width: calc(100vw - 200px);
    }

    .dialogContent {
        overflow: hidden;
        display: flex;
    }

    .dialogContainer {
        flex-wrap: nowrap;
    }
    
    .tableGrid {
        flex-grow: 1;
        display: flex;
        overflow: hidden;
    }

    .listGrid {
        width: 275px;
    }

    .selectGroupHeader {
        padding: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .selectedListItemContainer {
        &:hover {
            background-color: rgba(255, 196, 0, 0.2);
        }
    }

    .selectedListItem {
        padding-left: 12px;
    }
    
    .selectedGridPaper {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    
    .selectedListWrapper {
        overflow: hidden auto;
        flex-grow: 1;
        height: 50px; // just for flex to stretching to fit the container
    }

    .groupWrapper {
        padding-left: 12px;
        padding-right: 12px;
    }
    
    .dialogTitleWrapper {
        display: flex;
        align-items: center;
        padding: 12px 24px;
    }
    
    .dialogTitle {
        flex-grow: 1;
        margin-right: 30px;
        display: flex;
        align-items: center;
    }

    .filterPaper {
        width: 250px;
        overflow: hidden;
        background: rgba(43, 82, 73, 0.9);
        padding: 20px 20px 0;
    }
    
    .filterToolbar {
        justify-content: center;
        margin: 0 -2px;
    }
    
    .saveGroupInputRoot {
        padding-right: 8px;
    }

    .saveGroupInputOutline {
        border-color: #009688 !important;
        borderstyle: dashed;
    }
`);