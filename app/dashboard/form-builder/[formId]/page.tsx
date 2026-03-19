import { getFormWithItems } from "@/lib/actions/forms";
import { Form, FormItem, Product } from "@prisma/client";
import AddArticleModal from "@/components/kit-builder/AddArticleModal";
import FormItemList from "@/components/kit-builder/FormItemList";
import FormItemPreviewSection from "@/components/kit-builder/FormItemPreviewSection";

type FormWithItems = Form & { items: (FormItem & { product: Product })[] };

export default async function FormDetailPage({
  params,
}: {
  params: { formId: string };
}) {
  const formId = params.formId as string;
  const form = await getFormWithItems(formId);

  if (!form) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        Loading...
      </div>
    );
  }

  const basicItems = form.items.filter((item) => item.type === "BASIC");
  const extraItems = form.items.filter((item) => item.type === "EXTRA");

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="w-80 flex-shrink-0 flex flex-col border-r border-gray-200 bg-white overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-brand-navy text-sm">Kit Articles</h2>
            <div className="group relative flex items-center">
              <div className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px] font-bold cursor-help hover:bg-brand-navy hover:text-white transition-colors">
                i
              </div>
              <div className="absolute right-0 top-7 w-72 p-3 bg-brand-navy text-white text-xs rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 leading-relaxed">
                Add articles to this kit. Mark them as <strong>Basic</strong>{" "}
                (included in the membership fee) or <strong>Extra</strong>{" "}
                (optional, paid separately).
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Target groups: {form.targetGroups.join(", ")}
          </p>
        </div>

        <div className="p-4">
          <AddArticleModal formId={formId} />
        </div>

        <FormItemList form={form} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>👁</span>
            <span className="font-medium">Member Preview</span>
            <div className="group relative flex items-center">
              <div className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px] font-bold cursor-help hover:bg-brand-navy hover:text-white transition-colors">
                i
              </div>
              <div className="absolute left-0 top-7 w-72 p-3 bg-brand-navy text-white text-xs rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 leading-relaxed">
                This is exactly what your members will see when they open their
                personal order link. Use this to verify the kit before sending
                it out.
              </div>
            </div>
          </div>
          <button className="bg-brand-navy text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-green transition-colors">
            Save Kit
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {form.items.length === 0 ? (
            <div className="text-center text-gray-400 text-sm mt-20">
              <p className="text-2xl mb-2">📋</p>
              <p>Add articles to see the member preview.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full max-w-xl mx-auto p-8 space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-brand-navy">
                  Select Your Kit
                </h1>
                <p className="text-gray-400 text-sm">
                  Choose your sizes for each item
                </p>
              </div>

              <FormItemPreviewSection
                title="Basis Pakket"
                subtitle="Inbegrepen met lidgeld"
                items={basicItems}
              />

              <FormItemPreviewSection
                title="Extra's"
                subtitle="Optioneel — apart te betalen"
                items={extraItems}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
