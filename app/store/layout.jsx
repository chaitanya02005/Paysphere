import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "PaySphere. - Store Dashboard",
    description: "PaySphere. - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}
