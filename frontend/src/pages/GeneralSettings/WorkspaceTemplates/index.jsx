import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import WorkspaceTemplate from "@/models/workspaceTemplate";
import TemplateRow from "./TemplateRow";

export default function WorkspaceTemplates() {
    const [loading, setLoading] = useState(true);
    const [templates, setTemplates] = useState([]);

    const fetchTemplates = async () => {
        const foundTemplates = await WorkspaceTemplate.all();
        setTemplates(foundTemplates);
        setLoading(false);
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const removeTemplate = (id) => {
        setTemplates((prev) => prev.filter((template) => template.id !== id));
    };

    return (
        <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
            <Sidebar />
            <div
                style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
                className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
            >
                <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
                    <div className="w-full flex flex-col gap-y-1 pb-6 border-white/10 border-b-2">
                        <div className="items-center flex gap-x-4">
                            <p className="text-lg leading-6 font-bold text-theme-text-primary">
                                Workspace Templates
                            </p>
                        </div>
                        <p className="text-xs leading-[18px] font-base text-theme-text-secondary mt-2">
                            Manage reusable workspace templates. Templates allow you to quickly create
                            new workspaces with pre-configured settings like system prompts, chat modes,
                            and LLM preferences.
                        </p>
                    </div>
                    <div className="overflow-x-auto mt-6">
                        {loading ? (
                            <Skeleton.default
                                height="80vh"
                                width="100%"
                                highlightColor="var(--theme-bg-primary)"
                                baseColor="var(--theme-bg-secondary)"
                                count={1}
                                className="w-full p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm"
                                containerClassName="flex w-full"
                            />
                        ) : (
                            <table className="w-full text-xs text-left rounded-lg min-w-[640px] border-spacing-0">
                                <thead className="text-theme-text-secondary text-xs leading-[18px] font-bold uppercase border-white/10 border-b">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 rounded-tl-lg">
                                            Name
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Description
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Created
                                        </th>
                                        <th scope="col" className="px-6 py-3 rounded-tr-lg">
                                            {" "}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {templates.length === 0 ? (
                                        <tr className="bg-transparent text-theme-text-secondary text-sm font-medium">
                                            <td colSpan="4" className="px-6 py-4 text-center">
                                                No workspace templates found. Create one from any workspace's settings.
                                            </td>
                                        </tr>
                                    ) : (
                                        templates.map((template) => (
                                            <TemplateRow
                                                key={template.id}
                                                template={template}
                                                removeTemplate={removeTemplate}
                                            />
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
