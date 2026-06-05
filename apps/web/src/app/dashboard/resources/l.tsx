// "use client"

// import { useResources } from "@/app/store/resource-state";
// import { Button } from "@darasa-lako/ui/components/button";
// import { FolderIcon, PlusIcon } from "lucide-react";

// export default function ResourcesLayout({
//     children
// }: {
//     children: React.ReactNode
// }) {
//     return (
//         <div className="flex min-h-svh flex-col gap-6  p-6 md:p-10">
//             <div className="mx-auto w-full max-w-4xl space-y-6">
//                 <div className="flex items-center justify-between">
//                     {/* header */}
//                     <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center">
//                             <FolderIcon className="w-5 h-5 text-blue-600" />
//                         </div>
//                         <div>
//                             <h1 className="text-2xl font-bold text-slate-800">My Resources</h1>
//                             <p className="text-slate-500 text-sm">All materials assigned to you</p>
//                         </div>
//                     </div>
//                     {/* <h1 className='text-2xl font-bold'>My Resources</h1> */}
//                     <AddResourceButton />
//                 </div>
//                 {children}
//             </div>
//         </div>
//     )
// }

// function AddResourceButton() {
//     const { setActiveResourceEditId } = useResources();
//     return (
//         <Button onClick={() => setActiveResourceEditId("new")} variant="outline">
//             <PlusIcon className="w-4 h-4 mr-2" />
//             Create Resource
//         </Button>
//     )
// }
