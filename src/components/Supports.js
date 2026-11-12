const Supports = ({
  status,
  usedSupports,
  insuredCurrent,
  onUsePreview,
  onUseInsurance,
  onUseHint,
}) => {
  const canPreview = status === 'betting' && !usedSupports.preview;
  const canInsure =
    (status === 'betting' || status === 'answering') && !usedSupports.insurance;
  const canHint = status === 'answering' && !usedSupports.hint;

  return (
    <div className="supports-bar">
      <span>Quyền trợ giúp: </span>
      <button
        type="button"
        className="btn btn-support"
        onClick={onUsePreview}
        disabled={!canPreview}
      >
        Xem trước
      </button>
      <button
        type="button"
        className="btn btn-support"
        onClick={onUseInsurance}
        disabled={!canInsure}
      >
        {insuredCurrent || usedSupports.insurance ? 'Đã bảo hiểm' : 'Bảo hiểm'}
      </button>
      <button
        type="button"
        className="btn btn-support"
        onClick={onUseHint}
        disabled={!canHint}
      >
        Gợi ý
      </button>
    </div>
  );
};

export default Supports;
