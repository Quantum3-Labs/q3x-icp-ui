import Badge from "./Badge";

export enum TransactionType {
  SEND = "Send",
  SWAP = "Swap",
  THRESHOLD = "Threshold",
  ADD_SIGNER = "Add Signer",
  REMOVE_SIGNER = "Remove Signer",
  BATCH = "Batch",
}

interface TransactionRowProps {
  type: TransactionType;
  amount?: string;
  to?: string;
  threshold?: string;
  signers?: string[];
  status: "success" | "failed";
  showButtons?: boolean;
  showChevron?: boolean;
  showExternalLink?: boolean;
}

export default function TransactionRow({
  type,
  amount,
  to,
  threshold,
  signers,
  status,
  showButtons = true,
  showChevron = true,
  showExternalLink = false,
}: TransactionRowProps) {
  const renderContent = () => {
    switch (type) {
      case TransactionType.THRESHOLD:
        return (
          <>
            <span className=" text-text-primary">03</span>
            <img src="/arrow/thin-long-arrow-right.svg" alt="chevron" className="w-15" />
            <span className=" text-text-primary">05</span>
          </>
        );

      case TransactionType.ADD_SIGNER:
      case TransactionType.REMOVE_SIGNER:
        return (
          <div className="flex items-center gap-[7px]">
            {signers?.map((signer, index) => (
              <div
                key={index}
                className={`flex items-center justify-center px-2 py-[5px] rounded-full ${
                  type === TransactionType.REMOVE_SIGNER ? "bg-[#7b7b7b]" : "bg-primary"
                }`}
              >
                <span className="font-barlow-medium text-white text-xs leading-none ">{signer}</span>
              </div>
            ))}
          </div>
        );

      case TransactionType.BATCH:
        return <span className=" text-text-primary  leading-none">3 Transactions</span>;

      default:
        return (
          <>
            <span className=" text-text-primary leading-none">{amount}</span>
            <img src="/arrow/thin-long-arrow-right.svg" alt="chevron" className="w-15" />
            <span className=" text-text-primary leading-none">
              {type === TransactionType.SEND ? (
                <>
                  <span>To: [</span>
                  <span className="-medium text-text-primary">{to}</span>
                  <span>]</span>
                </>
              ) : (
                `To: ${to}`
              )}
            </span>
          </>
        );
    }
  };

  return (
    <div className="bg-[#f7f7f7] flex items-center gap-[7px] p-2 w-full justify-between flex-row">
      <div className="flex items-center gap-[7px]">
        <span className=" text-text-primary text-base leading-none  w-[110px] shrink-0">{type}</span>
        {renderContent()}
      </div>

      <div className="flex items-center gap-[7px]">
        <Badge status={status} />

        {showButtons && (
          <div className="flex items-center gap-[7px] shrink-0">
            <div className="bg-gradient-to-b from-[#f0f0f0] to-[#b0b0b0] flex items-center justify-center px-5 py-1.5 rounded-[10px] shadow-[0px_2px_4px_-1px_rgba(131,131,131,0.5),0px_0px_0px_1px_#c6c6c6]">
              <span className="font-medium text-[#676767] text-sm text-center">Deny</span>
            </div>
            <div className="bg-gradient-to-b from-[#9c9c9c] to-[#303030] flex items-center px-5 py-1.5 rounded-[10px] shadow-[0px_2px_4px_-1px_rgba(131,131,131,0.5),0px_0px_0px_1px_#a1a1a1]">
              <span className="font-medium text-white text-sm text-center">Approve</span>
            </div>
          </div>
        )}

        {showChevron && <img src="/arrow/chevron-down.svg" alt="chevron" className="w-5 h-5" />}

        {showExternalLink && <img src="/misc/external-link-icon.svg" alt="external link" className="w-5 h-5" />}
      </div>
    </div>
  );
}
