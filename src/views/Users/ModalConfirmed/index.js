import { ModalView } from "../../../components";
export default function ModalConfirmed({
  open,
  title,
  toogle,
  confirmed,
  data,
}) {
  return (
    <ModalView
      size="sm"
      title={title}
      modal={open}
      toggle={toogle}
      confirmed={() => confirmed(data.id)}
    >
      <span>Deseja realmente excluir o usuário?</span>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 10,
        }}
      >
        <span style={{ fontSize: 18 }}>{data?.name}</span>
        <span>{data?.email}</span>
      </div>
    </ModalView>
  );
}
