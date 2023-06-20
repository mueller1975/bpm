/**
 * 公司員工選取 Dialog
 */
import AddIcon from '@mui/icons-material/Add';
import CachedIcon from '@mui/icons-material/Cached';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import {
    Box, Button, DialogContent, Divider, Grid, IconButton, InputAdornment, List, ListItem,
    ListItemSecondaryAction, ListItemText, MenuItem, Paper, SpeedDial, SpeedDialAction,
    SpeedDialIcon, TextField, Typography, Zoom
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { SpringTransition2 } from 'Animations';
import { getBUList, getLocationList, getOUList, getUnitList } from 'API/WebAPI.jsx';
import { ConfirmDialog, RemoteDataTable, DraggableDialog, IconnedDialogTitle } from 'Components';
import { CSRF_HEADER, CSRF_TOKEN } from 'Config';
import { useNotification } from 'Hook/useTools.jsx';
import React from 'react';

const tableHeaders = [
    { prop: "empId", name: "帳號", width: 80, noWrap: true },
    { prop: "name", name: "名稱", width: 60, noWrap: true },
    { prop: "locName", name: "工作地", width: 80, noWrap: true },
    { prop: "costNo", name: "部門代號", width: 110, noWrap: true },
    { prop: "costName", name: "部門名稱", width: 150, noWrap: true },
    { prop: "postName", name: "職稱", width: 100, noWrap: true },
    { prop: "bu", name: "事業部/中心", width: 125, noWrap: true },
    { prop: "ou", name: "處級單位", width: 130, noWrap: true },
    { prop: "email", name: "E-mail", width: 250, noWrap: true },
]

const defaultState = {
    selectedUsers: [],
    selectedRows: [],
    clickedRow: null,
    groupName: '',
    errorSaveGroup: '',
    groupList: [],
    selectedGroup: { id: '', name: '' },
    fullScreen: false,

    locationFilter: '',
    buFilter: '',
    ouFilter: '',
    unitFilter: '',

    filterParams: '',

    locationList: [],
    buList: [],
    ouList: [],
    unitList: [],

    confirmDialog: { open: false },
    speedDialOpen: false,
}

class EmployeeDialog extends React.Component {

    constructor(props) {
        super(props)

        this.empTableRef = React.createRef()
        this.selectedUsers = null
        this.state = defaultState

        this.adjustDialogSize = this.adjustDialogSize.bind(this)
        this.fetchGroupList = this.fetchGroupList.bind(this)
        this.rowSelectedHandler = this.rowSelectedHandler.bind(this)
        this.clickRowHandler = this.clickRowHandler.bind(this)
        this.doubleClickRowHandler = this.doubleClickRowHandler.bind(this)
        this.addSelectedRowsToList = this.addSelectedRowsToList.bind(this)
        this.addToList = this.addToList.bind(this)
        this.deleteUser = this.deleteUser.bind(this)
        this.onConfirm = this.onConfirm.bind(this)
        this.onClose = this.onClose.bind(this)
        this.groupNameChangeHandler = this.groupNameChangeHandler.bind(this)
        this.clearFilters = this.clearFilters.bind(this)
        this.getFilterParams = this.getFilterParams.bind(this)
        this.locationFilterChangedHandler = this.locationFilterChangedHandler.bind(this)
        this.buFilterChangedHandler = this.buFilterChangedHandler.bind(this)
        this.ouFilterChangedHandler = this.ouFilterChangedHandler.bind(this)
        this.unitFilterChangedHandler = this.unitFilterChangedHandler.bind(this)
        this.selectGroup = this.selectGroup.bind(this)
        this.replaceUsers = this.replaceUsers.bind(this)
        this.appendUsers = this.appendUsers.bind(this)
        this.cancelConfirmDialog = this.cancelConfirmDialog.bind(this)
        this.saveGroup = this.saveGroup.bind(this)
        this.deleteGroup = this.deleteGroup.bind(this)
        this.dialogEntered = this.dialogEntered.bind(this)

        window.addEventListener("resize", this.adjustDialogSize)
    }

    componentDidMount() {
        this.fetchGroupList() // 取得個人使用者群組設定

        // 取得工作地列表
        getLocationList().then(locationList => {
            this.setState({ locationList })

            // 取得 BU 列表
            getBUList().then(buList => {
                this.setState({ buList })
            }).catch(error => {
                this.props.showError(error.message)
            })
        }).catch(error => {
            this.props.showError(error.message)
        })
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.adjustDialogSize, false)
    }

    adjustDialogSize(e) {
        if (this.props.open) {
            const fullScreen = e.currentTarget.innerWidth < 1200 || e.currentTarget.innerHeight < 800

            if ((fullScreen && !this.state.fullScreen) || (!fullScreen && this.state.fullScreen)) {
                this.setState({ fullScreen });
            }
        }
    }

    // dialog 開啟後, 觸發 resize 事件調整 dialog 是否 fullscreen 顯示
    dialogEntered() {
        window.dispatchEvent(new Event("resize")) // for Chrome
    }

    /* 查詢個人使用者群組設定 */
    fetchGroupList() {
        // fetch user groups
        fetch('service/app/usergroup/get', {
            method: 'POST',
            redirect: 'manual',
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
                        this.props.showError(`使用者群組查詢失敗（${vo.data}`);
                    }
                }).catch(error => {
                    console.log(error)
                    this.props.showError("您目前的工作階段已經結束，請刷新頁面重新登入！")
                });
            } else {
                console.log("Not OK!")
                console.log(response)
                let msg = response.type == 'opaqueredirect' ? '您目前的工作階段已經結束，請刷新頁面重新登入！' : `Error #${response.status}: 請試重新刷新頁面！`
                this.props.showError(msg)
            }
        }).catch(error => {
            console.log(error)
            this.props.showError("本系統目前無法提供服務，請稍候再試！")
        }); // fetch()
    }

    rowSelectedHandler(selectedRows) {
        this.setState({ selectedRows })
    }

    clickRowHandler(row) {
        this.setState({ clickedRow: row });
    }

    doubleClickRowHandler(row) {
        if (this.props.multiple) { // 多選
            this.addToList([row])
        } else { // 單選
            this.props.onConfirm(row);
        }
    }

    addSelectedRowsToList() {
        this.addToList(this.state.selectedRows)
    }

    addToList(usersToAdd) {

        let existedUsers = this.state.selectedUsers
        let users = usersToAdd

        if (existedUsers.length > 0) {
            let newUsers = usersToAdd.filter(user => {
                let duplicatedUser = existedUsers.find(u => u.empId === user.empId)
                return duplicatedUser == null
            })

            users = existedUsers.concat(newUsers)
        }

        this.setState({ selectedUsers: users })
    }

    deleteUser(empId) {
        let selectedUsers = this.state.selectedUsers.filter(user => user.empId != empId)
        this.setState({ selectedUsers })
    }

    /* 確認新增 */
    onConfirm() {
        if (this.props.multiple) { // 多選
            if (this.state.selectedUsers.length == 0) {
                this.props.showWarning("您尚未選取任何人員！")
            } else {
                this.props.onConfirm(this.state.selectedUsers)
                this.onClose()
            }
        } else if (!this.state.clickedRow) { // 單選            
            this.props.showWarning("請「雙擊」欲選取人員或按「取消」離開！");
        } else {
            this.props.onConfirm(this.state.clickedRow);
        }
    }

    onClose() {
        // this.setState(defaultState) // 不清空
        this.setState({ selectedUsers: [], selectedGroup: { id: '', name: '' }, groupName: '', errorSaveGroup: '' }) // 清空選取使用者列表相關狀態
        this.props.onClose()
    }

    groupNameChangeHandler(e) {
        const groupName = e.target.value
        this.setState({ groupName })
    }

    /* 清空過濾欄位 */
    clearFilters() {
        this.setState({ locationFilter: '', buFilter: '', ouFilter: '', unitFilter: '', ouList: [], unitList: [], filterParams: '' })
    }

    getFilterParams(filters) {
        const { locationFilter: locCode, buFilter: bu, ouFilter: ou, unitFilter: costNo } = { ...this.state, ...filters }
        return !locCode && !bu && !ou && !costNo ? '' : { locCode, bu, ou, costNo }
    }

    /* 工作地過濾條件更動時 */
    locationFilterChangedHandler(e) {
        const locationFilter = e.target.value
        const filterParams = this.getFilterParams({ locationFilter })
        this.setState({ locationFilter, filterParams })
    }

    /* BU 過濾條件更動時 */
    buFilterChangedHandler(e) {
        const buFilter = e.target.value
        const filters = { buFilter, ouFilter: '', unitFilter: '' }
        const filterParams = this.getFilterParams(filters)

        this.setState({ ...filters, ouList: [], unitList: [], filterParams }, () => {
            // 更新 ou 清單
            getOUList(buFilter).then(ouList => {
                this.setState({ ouList })
            }).catch(error => {
                this.props.showError(error.message)
            })
        })
    }

    /* OU 過濾條件更動時 */
    ouFilterChangedHandler(e) {
        const ouFilter = e.target.value
        const filters = { ouFilter, unitFilter: '' }
        const filterParams = this.getFilterParams(filters)

        this.setState({ ...filters, unitList: [], filterParams }, () => {
            // 更新部門清單
            getUnitList(this.state.buFilter, ouFilter).then(unitList => {
                this.setState({ unitList })
            }).catch(error => {
                this.props.showError(error.message)
            })
        })
    }

    /* 部門過濾條件更動時 */
    unitFilterChangedHandler(e) {
        const unitFilter = e.target.value
        const filterParams = this.getFilterParams({ unitFilter })

        this.setState({ unitFilter, filterParams })
    }

    /* 選取群組 */
    selectGroup(e) {
        let id = e.target.value;

        if (id === '') {
            return
        }

        let selectedGroup = this.state.groupList.find(group => group.id === id)

        if (this.state.selectedUsers.length == 0) {
            this.setState({ selectedGroup, selectedUsers: selectedGroup.users, groupName: selectedGroup.name, errorSaveGroup: '' })
        } else {
            this.selectedGroup = selectedGroup
            let confirmDialog = { open: true, title: "取代或加入確認", content: `您要將「${selectedGroup.name}」群組中的人員取代或加入已選取的人員列表中？`, severity: "warn" }

            this.setState({ confirmDialog })
        }
    }

    /* 群組成員取代已選取成員 */
    replaceUsers() {
        const selectedGroup = this.selectedGroup
        this.setState({ selectedGroup, selectedUsers: selectedGroup.users, groupName: selectedGroup.name, confirmDialog: { ...this.state.confirmDialog, open: false } })
    }

    /* 群組成員加入已選取成員 */
    appendUsers() {
        const selectedGroup = this.selectedGroup

        this.addToList(selectedGroup.users)
        this.setState({ selectedGroup, groupName: selectedGroup.name, confirmDialog: { ...this.state.confirmDialog, open: false } })
    }

    /* 取消群組選取 */
    cancelConfirmDialog() {
        let { confirmDialog } = this.state
        confirmDialog.open = false
        this.setState({ confirmDialog })
    }

    /* 儲存群組 */
    saveGroup() {
        let { groupName } = this.state

        groupName = groupName.trim()

        if (groupName == '') {
            this.setState({ groupName, errorSaveGroup: "請輸入群組名稱" })
        } else if (this.state.selectedUsers.length == 0) {
            this.setState({ errorSaveGroup: "請先選取人員至列表中" })
        } else {
            let empIds = this.state.selectedUsers.map(user => user.empId);
            let params = { groupName, empIds }

            fetch('service/app/usergroup/save', {
                body: JSON.stringify(params), redirect: 'manual',
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
                            this.props.showSuccess("使用者群組儲存成功！")
                        } else { // error
                            console.log(response)
                            this.props.showError("使用者群組儲存失敗！")
                        }
                    }).catch(error => {
                        console.log(error)
                        this.props.showError(error.message)
                    });
                } else {
                    let msg = response.type == 'opaqueredirect' ? '您目前的工作階段已經結束，請刷新頁面重新登入！' : `Error #${response.status}: 請試重新刷新頁面！`
                    this.props.showError(msg)
                }
            }).catch(error => {
                const msg = error.message == "Failed to fetch" ? "伺服器目前無法連線！" : error.message
                this.props.showError(msg)
            }); // fetch()
        } // if()
    } // saveGroup()

    /* 刪除群組 */
    deleteGroup() {
        let { groupName } = this.state

        groupName = groupName.trim()

        if (groupName == '') {
            this.setState({ groupName, errorSaveGroup: "請輸入群組名稱" })
        } else if (this.state.selectedUsers.length == 0) {
            this.setState({ errorSaveGroup: "請先選取人員至列表中" })
        } else {
            let empIds = this.state.selectedUsers.map(user => user.empId);
            let params = { groupName, empIds }

            fetch('service/app/usergroup/delete', {
                body: `groupName=${groupName}`, redirect: 'manual',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    [CSRF_HEADER]: CSRF_TOKEN
                }
            }).then(response => {
                if (response.ok) {
                    response.json().then(vo => {

                        if (vo.code == 0) { // success
                            this.setState({ groupName: '' }, () => this.fetchGroupList())
                            this.props.showSuccess("使用者群組刪除成功！")
                        } else { // error
                            console.log(response)
                            this.props.showError("使用者群組刪除失敗！")
                        }
                    }).catch(error => {
                        console.log(error)
                        this.props.showError(error.message)
                    });
                } else {
                    let msg = response.type == 'opaqueredirect' ? '您目前的工作階段已經結束，請刷新頁面重新登入！' : `Error #${response.status}: 請試重新刷新頁面！`
                    this.props.showError(msg)
                }
            }).catch(error => {
                const msg = error.message == "Failed to fetch" ? "伺服器目前無法連線！" : error.message
                this.props.showError(msg)
            }); // fetch()
        } // if()
    } // saveGroup()

    render() {
        const { multiple = false } = this.props
        const { selectedRows, speedDialOpen, locationList, buList, ouList, unitList, locationFilter, buFilter, ouFilter, unitFilter, filterParams,
            fullScreen, confirmDialog } = this.state

        const filter = (
            <Box width={300} sx={{ padding: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField name="locationFilter" select fullWidth label="工作地" size="small" value={locationFilter}
                            onChange={this.locationFilterChangedHandler}>
                            <MenuItem value=""><em>清空此欄</em></MenuItem>
                            {locationList.map((loc, index) =>
                                <MenuItem key={index} value={loc.code}>{loc.name}</MenuItem>
                            )}
                        </TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField name="buFilter" select fullWidth label="事業部/中心" size="small" value={buFilter}
                            onChange={this.buFilterChangedHandler}>
                            <MenuItem value=""><em>清空此欄</em></MenuItem>
                            {buList.map((bu, index) =>
                                <MenuItem key={index} value={bu}>{bu === '.' ? '無' : bu}</MenuItem>
                            )}
                        </TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField name="ouFilter" select fullWidth label="處級單位" size="small" disabled={buFilter === ''}
                            value={ouFilter} onChange={this.ouFilterChangedHandler}>
                            <MenuItem value=""><em>清空此欄</em></MenuItem>
                            {ouList.map((ou, index) =>
                                <MenuItem key={index} value={ou}>{ou === '.' ? '無' : ou}</MenuItem>
                            )}
                        </TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField name="unitFilter" select fullWidth label="部門" size="small" disabled={buFilter === ''}
                            value={unitFilter} onChange={this.unitFilterChangedHandler}>
                            <MenuItem value=""><em>清空此欄</em></MenuItem>
                            {unitList.map((unit, index) =>
                                <MenuItem key={index} value={unit.costNo}>{unit.costName}</MenuItem>
                            )}
                        </TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <Button fullWidth variant="contained" color="secondary" onClick={this.clearFilters}
                            disabled={!locationFilter && !buFilter && !ouFilter && !unitFilter}>
                            <Typography variant="body1">清空所有欄位</Typography>
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        )

        return (
            <>
                {/* 詢問取代或加入 Dialog */}
                <ConfirmDialog open={confirmDialog.open} title={confirmDialog.title} content={confirmDialog.content} severity={confirmDialog.severity}
                    actionButtons={[
                        <Button key="cancel" variant="contained" onClick={this.cancelConfirmDialog} startIcon={<ClearIcon />}>取消</Button>,
                        <Button key="replace" variant="contained" color="warning" onClick={this.replaceUsers} startIcon={<CachedIcon />}>取代</Button>,
                        <Button key="append" variant="contained" color="secondary" onClick={this.appendUsers} startIcon={<AddIcon />}>加入</Button>
                    ]}>
                </ConfirmDialog>

                <DraggableDialog maxWidth={fullScreen ? false : 'lg'} fullScreen={fullScreen} open={this.props.open}
                    className={this.props.className} classes={{ paper: 'dialogPaper' }} TransitionProps={{ onEntered: this.dialogEntered }}
                    TransitionComponent={Zoom}>
                    <IconnedDialogTitle icon={PersonAddIcon} title={this.props.title} className="dialogTitle">
                        <Button variant="contained" startIcon={<ClearIcon />} onClick={this.onClose}>取消</Button>
                        <Button variant="contained" color="secondary" startIcon={<CheckIcon />} onClick={this.onConfirm}
                            disabled={(!multiple && !this.state.clickedRow) || (multiple && this.state.selectedUsers == 0)}>確定</Button>
                    </IconnedDialogTitle>

                    <DialogContent className="dialogContent">
                        <Grid container spacing={2} className="dialogContainer">

                            {/* Table Grid */}
                            <Grid item className="tableGrid">
                                <div style={{ width: '100%', height: '100%' }}>
                                    {/* 人員清單表格 */}
                                    <RemoteDataTable ref={this.empTableRef} showCheckbox={multiple} enableKeywordSearch resizable roundCorner storageKey="employee"
                                        options={{
                                            title: "人員清單", columns: tableHeaders, serviceUrl: "service/app/employee/list",
                                            size: 15, sizeOptions: [10, 15, 20, 25, 40, 50, 75]
                                        }}
                                        toolbarClassName="tableToolbar" onChangeTable={this.tableChangedHandler}
                                        onSelectRow={this.rowSelectedHandler} onDoubleClickRow={this.doubleClickRowHandler}
                                        onClickRow={this.clickRowHandler}
                                        filter={filter} filterParams={filterParams}

                                        actionButtons={[
                                            { action: this.addSelectedRowsToList, icon: PlaylistAddIcon, tooltip: '選取至列表', color: 'secondary', disabled: selectedRows.length == 0 }
                                        ]} />
                                </div>
                            </Grid>

                            {/* Selected List Grid */}
                            {
                                !multiple ? undefined :
                                    <Grid item className="listGrid">
                                        <Paper className="selectedGridPaper">
                                            <Typography variant="subtitle1" className="selectGroupHeader"><PlaylistAddCheckIcon sx={{ mr: .5 }} />已選取人員 ( {this.state.selectedUsers.length} )</Typography>
                                            <Divider />

                                            <div className="groupWrapper">
                                                <TextField size="small" margin="none" select fullWidth variant="outlined" label="選擇人員群組"
                                                    value={this.state.selectedGroup.id} onChange={this.selectGroup}>

                                                    {this.state.groupList.length == 0 &&
                                                        <MenuItem value="">您尚未儲存任何群組</MenuItem>
                                                    }
                                                    {this.state.groupList.map((group, index) =>
                                                        <MenuItem key={index} value={group.id}>{group.name}</MenuItem>)
                                                    }
                                                </TextField>
                                            </div>

                                            <div className="selectedListWrapper">
                                                <List dense className="selectedList">
                                                    <SpringTransition2 effect="slide" items={this.state.selectedUsers} trail={100} keys={user => user.empId}>
                                                        {
                                                            user =>
                                                                <ListItem dense className="selectedListItem" classes={{ container: 'selectedListItemContainer' }} disableGutters>
                                                                    <ListItemText primary={`${user.name} ${user.empId}`} secondary={user.costnam} />
                                                                    <ListItemSecondaryAction>
                                                                        <IconButton onClick={e => { this.deleteUser(user.empId) }}><DeleteIcon /></IconButton>
                                                                    </ListItemSecondaryAction>
                                                                </ListItem>
                                                        }
                                                    </SpringTransition2>
                                                </List>
                                            </div>

                                            <div className="groupWrapper">
                                                <TextField fullWidth size="small" margin="none" variant="outlined" label="人員群組名稱" placeholder="輸入欲儲存群組名稱"
                                                    error={this.state.errorSaveGroup !== ''} onChange={this.groupNameChangeHandler} value={this.state.groupName}
                                                    helperText={this.state.errorSaveGroup}
                                                    InputProps={{
                                                        classes: { root: 'saveGroupInputRoot', notchedOutline: 'saveGroupInputOutline' },
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <SpeedDial ariaLabel="動作" open={speedDialOpen} direction="up" icon={<SpeedDialIcon />}
                                                                    FabProps={{ size: "small" }}
                                                                    className="speedDial" onOpen={() => this.setState({ speedDialOpen: true })}
                                                                    onClose={() => this.setState({ speedDialOpen: false })}>
                                                                    <SpeedDialAction icon={<DeleteIcon />} tooltipTitle="刪除" onClick={this.deleteGroup} />
                                                                    <SpeedDialAction icon={<SaveAltIcon />} tooltipTitle="儲存" onClick={this.saveGroup} />
                                                                </SpeedDial>
                                                            </InputAdornment>
                                                        )
                                                    }} />
                                            </div>

                                        </Paper>
                                    </Grid>
                            }
                        </Grid>
                    </DialogContent>

                    {/* <DialogActions /> */}
                </DraggableDialog>
            </>
        ); // return
    } // render()
} // EmployeeDialog


const EmpDialog = React.memo(props => {
    const { showSuccess, showInfo, showWarning, showError } = useNotification()

    return <EmployeeDialog {...props} showSuccess={showSuccess} showInfo={showInfo} showWarning={showWarning} showError={showError} />
})

// const StyledComponent = withStyles(styles)(EmpDialog)
const StyledComponent = styled(EmpDialog)`
    .tablePaper {
        min-height: calc(100vh - 250px);
        overflow: auto;
        height: 100%;
        width: 100%;
    }

    .tableToolbar {
        background-color: #142d50;
    }

    .dialogTitle {
        padding-bottom: 2px;
    }

    .dialogPaper {
        min-width: calc(100vw - 200px);
    }

    .dialogContent {
        overflow: hidden;
        display: flex;
        padding: ${({ multiple }) => multiple ? '0 20px 4px 8px' : '0 4px 4px 8px'};
    }

    .dialogContainer {
        flex-wrap: nowrap;
        min-height: 500px;
    }

    .tableGrid {
        flex-grow: 1;
        display: flex;
        overflow: hidden;
        width: 100%;
    }

    .listGrid {
        width: 275px;
        padding-top: 26px !important;
        padding-left: 4px !important;
        padding-bottom: 12px;
    }

    .selectGroupHeader {
        padding: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .selectedList {
        overflow: hidden auto;
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
        background-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(243 243 243 / 70%)' : undefined};
    }

    .selectedListWrapper {
        overflow: hidden auto;
        flex-grow: 1;
        height: 50px; /* just for flex to stretching to fit the container */
    }

    .groupWrapper {
        padding: 8px;
    }

    .saveGroupInputRoot {
        padding-right: 8px;
    }

    .saveGroupInputOutline {
        border-color: #2196F3 !important;
        border-style: dashed;
    }
    
    .speedDial {
        height: 36px;
    }
`;

export default React.memo(React.forwardRef((props, ref) => <StyledComponent {...props} innerRef={ref} />));