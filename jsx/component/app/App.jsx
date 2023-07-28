import Loading from 'Component/Loading.jsx';
import React, { Suspense, useState } from 'react';
import Authorizable from './Authorizable.jsx';
import CompsiteForm from './CompsiteForm.jsx';
import Stateful from './Stateful.jsx';
import FormDialog from './FormDialog.jsx';
import CrudView from './CrudView.jsx';
import { VIEW_KEY, TABLE_OPTIONS } from './lib/view';

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

            <CrudView tableKey={VIEW_KEY} tableOptions={TABLE_OPTIONS}
                onAdd={addForm} onEdit={editForm} />
        </>
    );
}));