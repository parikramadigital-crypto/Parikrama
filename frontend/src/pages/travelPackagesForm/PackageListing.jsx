import PackageCard from "../../components/ui/PackageCard";
import mockPackages from "../../constants/Constants";

export default function PackagesListing() {
  // Later replace this with API response
  const packages = mockPackages;

  return (
    <div className="py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-14">
        <Section title="🔥 Hot Deals" data={packages.hotDeals} />
        <Section title="📈 Trending Deals" data={packages.trendingDeals} />
        <Section title="⭐ Exclusive Deals" data={packages.exclusiveDeals} />
      </div>
    </div>
  );
}

/* ---------- Section Wrapper ---------- */

function Section({ title, data }) {
  if (!data?.length) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 border-l-4 border-[#FFC20E] pl-3">
        {title}
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((pkg) => (
          <PackageCard key={pkg.id} data={pkg} />
        ))}
      </div>
    </div>
  );
}
