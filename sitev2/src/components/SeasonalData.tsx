import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface SeasonData {
  season: string;
  temperature: string;
  biodiversity: string;
  change: string;
  trend: "up" | "down" | "stable";
}

interface SeasonalDataProps {
  year: string;
  target: string;
}

const seasonalData: Record<string, SeasonData[]> = {
  "2021": [
    { season: "Spring", temperature: "16°C", biodiversity: "High", change: "+3%", trend: "up" },
    { season: "Summer", temperature: "22°C", biodiversity: "Very High", change: "+5%", trend: "up" },
    { season: "Fall", temperature: "18°C", biodiversity: "High", change: "+2%", trend: "up" },
    { season: "Winter", temperature: "12°C", biodiversity: "Medium", change: "-1%", trend: "down" },
  ],
  "2022": [
    { season: "Spring", temperature: "17°C", biodiversity: "High", change: "+4%", trend: "up" },
    { season: "Summer", temperature: "23°C", biodiversity: "Very High", change: "+6%", trend: "up" },
    { season: "Fall", temperature: "19°C", biodiversity: "High", change: "+3%", trend: "up" },
    { season: "Winter", temperature: "13°C", biodiversity: "Medium", change: "0%", trend: "stable" },
  ],
  "2023": [
    { season: "Spring", temperature: "18°C", biodiversity: "Very High", change: "+7%", trend: "up" },
    { season: "Summer", temperature: "24°C", biodiversity: "Very High", change: "+8%", trend: "up" },
    { season: "Fall", temperature: "20°C", biodiversity: "High", change: "+5%", trend: "up" },
    { season: "Winter", temperature: "14°C", biodiversity: "Medium", change: "+2%", trend: "up" },
  ],
};

export function SeasonalData({ year, target }: SeasonalDataProps) {
  const data = seasonalData[year] || seasonalData["2023"];
  
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-green-600";
      case "down": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return "↑";
      case "down": return "↓";
      default: return "→";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((season, index) => (
        <Card key={index} className="hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>{season.season}</span>
              <span className={`text-2xl ${getTrendColor(season.trend)}`}>
                {getTrendIcon(season.trend)}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Temperature:</span>
              <span className="font-semibold">{season.temperature}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Biodiversity:</span>
              <span className="font-semibold">{season.biodiversity}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Change:</span>
              <span className={`font-semibold ${getTrendColor(season.trend)}`}>
                {season.change}
              </span>
            </div>
            <div className="mt-4 pt-3 border-t">
              <div className="text-sm text-gray-500">Target: {target}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
