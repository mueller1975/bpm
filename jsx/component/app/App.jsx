import Loading from 'Component/Loading.jsx';
import React, { Suspense, useState } from 'react';
import Authorizable from './Authorizable.jsx';
import CompsiteForm from './CompsiteForm.jsx';
import Stateful from './Stateful.jsx';
import FormDialog from './FormDialog.jsx';
import CrudView from './CrudView.jsx';

const VIEW_KEY = "CRUD_VIEW";

const tableOptions = {
    title: "品名",
    autoFetch: true, columns: [
        { prop: 'code', name: '品名碼', width: 80 },
        { prop: 'id', name: 'ID', width: 200 },
    ],
    serviceUrl: "service/form/list",
    params: {},
    size: 15, sizeOptions: [10, 15, 25, 50, 75], sortProp: "code", sortOrder: "asc",
};

export default React.memo(React.forwardRef((props, ref) => {
    // const [form, setForm] = useState({ id: '12345', jsonData: '{}' });
    const [form, setForm] = useState({});
    const [formOpen, setFormOpen] = useState(false);

    const addForm = () => {
        setForm({});
        setFormOpen(true);
    };

    const editForm = form => {
        setForm(form);
        setFormOpen(true);
    };

    return (
        <>
            <FormDialog open={formOpen} formData={form} />

            <CrudView tableKey={VIEW_KEY} tableOptions={tableOptions}
                onAdd={addForm} onEdit={editForm} />
        </>
    );
}));