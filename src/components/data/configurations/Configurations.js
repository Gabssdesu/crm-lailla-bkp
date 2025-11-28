import { useState, useRef } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { InputSwitch } from "primereact/inputswitch";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

export default function SettingsPage({ dataCW, reasons, appointments, setAppointments, setReasons, treatments, setTreatments, enviarConfiguracao }) {

    const [newAppointment, setNewAppointment] = useState("");
    const [newAppointmentKey, setNewAppointmentKey] = useState("");

    const [newTreatment, setNewTreatment] = useState("");
    const [newTreatmentKey, setNewTreatmentKey] = useState("");

    const [newReason, setNewReason] = useState("");
    const [newReasonKey, setNewReasonKey] = useState("");

    const toast = useRef(null);

    const toggleOptionStatus = async (id, tableName, currentStatus, items, setItems) => {
        try {
            const response = await fetch('/api/configurations/toggle-option', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    tableName,
                    status: !currentStatus
                })
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar status');
            }

            const result = await response.json();
            
            // Atualiza o estado local
            const updatedItems = { ...items };
            Object.keys(updatedItems).forEach(key => {
                if (updatedItems[key].id === id) {
                    updatedItems[key].status = !currentStatus;
                }
            });
            setItems(updatedItems);

            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: result.message,
                life: 3000
            });
            
            // Não recarregar a página automaticamente
            // Deixe o Next.js lidar com a atualização dos componentes

        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao atualizar status da opção',
                life: 3000
            });
        }
    };
   

    const addConfigItem = async ({
        type, // "appointment", "treatment" ou "reason"
        items,
        setItems,
        newName,
        setNewName,
        newKey,
        setNewKey,
    }) => {
        if (items[newKey]) {
            toast.current.show({
                severity: 'warn',
                summary: 'Atenção',
                detail: `Já existe um${type === "reason" ? " motivo" : type === "treatment" ? " tratamento" : "a consulta"} com essa chave!`,
                life: 3000
            });
            return;
        }
        if (newKey.trim() && newName.trim()) {
            try {
                const config = {
                    display_name: newName,
                    value: newKey,
                    table_name: type === "reason" ? "options_rejection" : "options_service",
                    method: "POST"
                };
                if (type === "appointment") config.type_value = "consulta";
                if (type === "treatment") config.type_value = "acompanhamento";

                // Chama a função enviada via props
                const result = await enviarConfiguracao(config);
                setItems({
                    ...items,
                    [newKey]: { 
                        display_name: newName, 
                        value: newKey, 
                        id: result.id,
                        status: true 
                    }
                });
                setNewName("");
                setNewKey("");
                
                toast.current.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: `${type === "reason" ? "Motivo" : type === "treatment" ? "Tratamento" : "Consulta"} adicionado(a) com sucesso!`,
                    life: 3000
                });
                
                // Não recarregar a página automaticamente
                // Deixe o Next.js lidar com a atualização dos componentes
            } catch (err) {
                console.error("Erro detalhado:", err);
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: `Erro ao adicionar ${type === "reason" ? "motivo" : type === "treatment" ? "tratamento" : "serviço"}.`,
                    life: 3000
                });
            }
        }
    };

    const deleteConfigItem = async ({
        key,
        items,
        setItems,
        tableName
    }) => {
        try {
            // Chama a função enviada via props
            await enviarConfiguracao({
                display_name: items[key].display_name,
                value: items[key].value, // Adiciona o campo value que estava faltando
                table_name: tableName,
                method: "DELETE",
                id: items[key].id
            });
            const updatedItems = { ...items };
            delete updatedItems[key];
            setItems(updatedItems);
            
            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Item excluído com sucesso!',
                life: 3000
            });
            
            // Não recarregar a página automaticamente
            // Deixe o Next.js lidar com a atualização dos componentes
        } catch (err) {
            console.error("Erro ao deletar item:", err);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao excluir item.',
                life: 3000
            });
        }
    };

    const confirmDelete = (item, deleteParams) => {
        confirmDialog({
            message: `Tem certeza que deseja excluir "${item.display_name}"?`,
            header: 'Confirmar Exclusão',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Sim, excluir',
            rejectLabel: 'Cancelar',
            accept: () => deleteConfigItem(deleteParams)
        });
    };

    const gerarChave = (str) => {
        return str
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/-+/g, "-") // evita múltiplos hífens seguidos
            .replace(/(^-|-$)/g, "");
    }

    const handleServiceNameChange = (e) => {
        const nome = e.target.value;
        setNewAppointment(nome);
        setNewAppointmentKey(gerarChave(nome));
    };

    const handleTreatmentNameChange = (e) => {
        const nome = e.target.value;
        setNewTreatment(nome);
        setNewTreatmentKey(gerarChave(nome));
    };


    // Atualiza a chave automaticamente ao digitar o nome do motivo
    const handleReasonNameChange = (e) => {
        const nome = e.target.value;
        setNewReason(nome);
        setNewReasonKey(gerarChave(nome));
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
            <Toast ref={toast} />
            <ConfirmDialog />
            <Card
                title={
                    <div style={{ display: "flex", alignItems: "center" }}>
                        Consultas disponíveis
                    </div>
                }
                style={{ marginTop: "10px", margin: "15px" }}
                className="p-m-3 card"
            >
                {Object.entries(appointments || {}).map(([key, value]) => (
                    <div key={key} className="item-config">
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <span style={{
                                display: "inline-block",
                                width: 9,
                                height: 9,
                                borderRadius: "50%",
                                background: value.status ? "#2196f3" : "#ccc"
                            }} />
                            <p style={{ 
                                textAlign: "center", 
                                marginBottom: 0, 
                                marginLeft: "8px",
                                opacity: value.status ? 1 : 0.5
                            }}>
                                <b>{value.display_name}</b>
                                <span style={{ color: "rgb(107 114 158 / var(--tw-text-opacity, 1))", marginLeft: "5px", fontSize: "13px" }}> ({value.value})</span> 
                            </p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <InputSwitch 
                                checked={value.status || false} 
                                onChange={() => toggleOptionStatus(
                                    value.id, 
                                    "options_service", 
                                    value.status, 
                                    appointments, 
                                    setAppointments
                                )} 
                            />
                            <i
                                className="pi pi-times delete-option"
                                onClick={() =>
                                    confirmDelete(value, {
                                        key,
                                        items: appointments,
                                        setItems: setAppointments,
                                        tableName: "options_service"
                                    })
                                }
                            />
                        </div>
                    </div>
                ))}
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <InputText
                        type="text"
                        value={newAppointment}
                        onChange={handleServiceNameChange}
                        placeholder="Nome do serviço"
                        
                        style={{ flex: 2, borderRadius: 6, border: "1px solid #ccc", padding: 8 }}
                    />
                    <InputText
                        type="text"
                        value={newAppointmentKey}
                        onChange={e => setNewAppointmentKey(gerarChave(e.target.value))}
                        placeholder="Chave"
                        disabled
                        style={{ flex: 1, borderRadius: 6, border: "1px solid #ccc", padding: 8 }}
                    />

                    <Button
                        onClick={() =>
                            addConfigItem({
                                type: "appointment",
                                items: appointments,
                                setItems: setAppointments,
                                newName: newAppointment,
                                setNewName: setNewAppointment,
                                newKey: newAppointmentKey,
                                setNewKey: setNewAppointmentKey
                            })
                        }
                        style={{ borderRadius: 6, padding: "6px 16px" }}
                        label="Adicionar"
                        icon="pi pi-plus"
                    />
                </div>
            </Card>

            <Card
                title={
                    <div style={{ display: "flex", alignItems: "center" }}>
                        Tratamentos disponíveis
                    </div>
                }
                style={{ marginTop: "10px", margin: "15px" }}
                className="p-m-3 card"
            >
                {Object.entries(treatments || {}).map(([key, value]) => (
                    <div key={key} className="item-config">
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <span style={{
                                display: "inline-block",
                                width: 9,
                                height: 9,
                                borderRadius: "50%",
                                background: value.status ? "#3246f3" : "#ccc"
                            }} />
                            <p style={{ 
                                textAlign: "center", 
                                marginBottom: 0, 
                                marginLeft: "8px",
                                opacity: value.status ? 1 : 0.5
                            }}>
                                <b>{value.display_name}</b>
                                <span style={{ color: "rgb(107 114 158 / var(--tw-text-opacity, 1))", marginLeft: "5px", fontSize: "13px" }}> ({value.value})</span> 
                            </p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <InputSwitch 
                                checked={value.status || false} 
                                onChange={() => toggleOptionStatus(
                                    value.id, 
                                    "options_service", 
                                    value.status, 
                                    treatments, 
                                    setTreatments
                                )} 
                            />
                            <i
                                className="pi pi-times delete-option"
                                onClick={() =>
                                    confirmDelete(value, {
                                        key,
                                        items: treatments,
                                        setItems: setTreatments,
                                        tableName: "options_service"
                                    })
                                }
                            />
                        </div>
                    </div>
                ))}
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <InputText
                        type="text"
                        value={newTreatment}
                        onChange={handleTreatmentNameChange}
                        placeholder="Nome do tratamento"
                        style={{ flex: 2, borderRadius: 6, border: "1px solid #ccc", padding: 8 }}
                    />
                    <InputText
                        type="text"
                        value={newTreatmentKey}
                        onChange={e => setNewTreatmentKey(gerarChave(e.target.value))}
                        placeholder="Chave"
                        disabled
                        style={{ flex: 1, borderRadius: 6, border: "1px solid #ccc", padding: 8 }}
                    />

                    <Button
                        onClick={() =>
                            addConfigItem({
                                type: "treatment",
                                items: treatments,
                                setItems: setTreatments,
                                newName: newTreatment,
                                setNewName: setNewTreatment,
                                newKey: newTreatmentKey,
                                setNewKey: setNewTreatmentKey
                            })
                        }
                        style={{ borderRadius: 6, padding: "6px 16px" }}
                        label="Adicionar"
                        icon="pi pi-plus"
                    />
                </div>
            </Card>

            <Card
                title={
                    <div style={{ display: "flex", alignItems: "center" }}>
                        Motivos de Objeção disponíveis
                    </div>
                }
                style={{ marginTop: "10px", margin: "15px" }}
                className="p-m-3 card"
            >
                {Object.entries(reasons || {}).map(([key, value]) => (
                    <div key={key} className="item-config">
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <span style={{
                                display: "inline-block",
                                width: 9,
                                height: 9,
                                borderRadius: "50%",
                                background: value.status ? "#f38321" : "#ccc"
                            }} />
                            <p style={{ 
                                textAlign: "center", 
                                marginBottom: 0, 
                                marginLeft: "8px",
                                opacity: value.status ? 1 : 0.5
                            }}>
                                <b>{value.display_name}</b>
                                <span style={{ color: "rgb(107 114 158 / var(--tw-text-opacity, 1))", marginLeft: "5px", fontSize: "13px" }}> ({value.value})</span> 
                            </p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <InputSwitch 
                                checked={value.status || false} 
                                onChange={() => toggleOptionStatus(
                                    value.id, 
                                    "options_rejection", 
                                    value.status, 
                                    reasons, 
                                    setReasons
                                )} 
                            />
                            <i
                                className="pi pi-times delete-option"
                                onClick={() =>
                                    confirmDelete(value, {
                                        key,
                                        items: reasons,
                                        setItems: setReasons,
                                        tableName: "options_rejection"
                                    })
                                }
                            />
                        </div>
                    </div>
                ))}
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <InputText
                        type="text"
                        value={newReason}
                        onChange={handleReasonNameChange}
                        placeholder="Nome do motivo"
                        style={{ flex: 2, borderRadius: 6, border: "1px solid #ccc", padding: 8 }}
                    />
                    <InputText
                        type="text"
                        value={newReasonKey}
                        onChange={e => setNewReasonKey(gerarChave(e.target.value))}
                        placeholder="Chave"
                        disabled
                        style={{ flex: 1, borderRadius: 6, border: "1px solid #ccc", padding: 8 }}
                    />

                    <Button
                        onClick={() =>
                            addConfigItem({
                                type: "reason",
                                items: reasons,
                                setItems: setReasons,
                                newName: newReason,
                                setNewName: setNewReason,
                                newKey: newReasonKey,
                                setNewKey: setNewReasonKey
                            })
                        }
                        style={{ borderRadius: 6, padding: "6px 16px" }}
                        label="Adicionar"
                        icon="pi pi-plus"
                    />
                </div>
            </Card>
        </div>
    );
}