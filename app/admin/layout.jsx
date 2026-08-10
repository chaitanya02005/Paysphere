import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "PaySphere. - Admin",
    description: "PaySphere. - Admin",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
