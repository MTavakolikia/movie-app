import AdvanceSearch from "@/components/search/AdvanceSearch";

export default function page() {
    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-center my-6  bg-gradient-to-b from-violet-800 to-violet-400 bg-clip-text text-transparent">🔎Advance Movie Search</h1>
            <AdvanceSearch />
        </div>
    )
}
