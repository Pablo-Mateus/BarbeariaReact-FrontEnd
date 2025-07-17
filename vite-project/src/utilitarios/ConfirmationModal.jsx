import React from "react";
import modalStyles from "../styles/ArchiveConfirmationModal.module.css";

/**
 * Modal de confirmação para arquivar agendamentos.
 * @param {object} props
 * @param {boolean} props.isOpen - Se o modal deve estar visível.
 * @param {function} props.onClose - Função chamada ao fechar (cancelar).
 * @param {function} props.onConfirmArchive - Função chamada ao confirmar o arquivamento.
 */
function ArchiveConfirmationModal({ isOpen, onClose, onConfirmArchive }) {
  if (!isOpen) {
    return null; // Não renderiza nada se não estiver aberto
  }

  // Função para lidar com o clique fora do modal (opcional, para fechar)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      // Verifica se o clique foi no overlay e não no conteúdo
      onClose();
    }
  };

  return (
    <div className={modalStyles.modalOverlay} onClick={handleOverlayClick}>
      <div className={modalStyles.modalContent}>
        <h2 className={modalStyles.modalTitle}>Arquivar Agendamento?</h2>
        <p className={modalStyles.modalMessage}>
          Tem certeza que deseja arquivar este agendamento?
          <br />
          Ele será ocultado da sua lista de agendamentos.
          <br />
          <strong className={modalStyles.warningText}>
            Agendamentos arquivados são removidos permanentemente do sistema.
          </strong>
        </p>
        <div className={modalStyles.modalActions}>
          <button
            className={`${modalStyles.button} ${modalStyles.cancelButton}`}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className={`${modalStyles.button} ${modalStyles.confirmButton}`}
            onClick={onConfirmArchive}
          >
            Sim, Arquivar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ArchiveConfirmationModal;
