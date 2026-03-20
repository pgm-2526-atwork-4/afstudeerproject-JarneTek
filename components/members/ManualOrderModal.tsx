import MemberFormItems from "./memberFormItems";
import { getMemberFormItemsFromToken } from "@/lib/actions/members";

type FormWithItems = Awaited<ReturnType<typeof getMemberFormItemsFromToken>>;

export default function ManualOrderModal({
  loading,
  form,
  memberId,
  clubId,
  setOpen,
}: {
  loading: boolean;
  form: FormWithItems | null;
  memberId: string;
  clubId: string;
  setOpen: (open: boolean) => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-gray-50 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white border-b border-gray-100 flex items-center justify-between px-6 py-5 flex-shrink-0 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-green to-teal-400" />
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xs font-bold shadow-inner border border-gray-100 uppercase text-gray-400">
              Form
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-navy tracking-tight">
                Manual Order
              </h2>
              <p className="text-xs text-gray-500 font-medium tracking-wide">
                Place an order on behalf of this member
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 text-gray-400 flex items-center justify-center transition-all text-lg font-bold"
            title="Close"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto flex-1 custom-scrollbar">
          <div className="p-6 sm:p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
                <div className="w-10 h-10 border-4 border-brand-green/30 border-t-brand-green rounded-full animate-spin" />
                <p className="text-sm font-medium animate-pulse uppercase tracking-widest">
                  Fetching products...
                </p>
              </div>
            ) : form ? (
              <MemberFormItems
                form={form}
                memberId={memberId}
                clubId={clubId}
                onSuccess={() => setOpen(false)}
                hideExtrasPopup={true}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-xl font-black">
                  !
                </div>
                <p className="text-gray-500 font-medium text-sm">
                  No form found for this member&apos;s group.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
