import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import fishingDataUK2021 from "../data/vertebrates/uk/fishingeffort_UK2021MONTHLY.json";
import fishingDataUK2022 from "../data/vertebrates/uk/fishingeffort_UK2022MONTHLY.json";
import fishingDataUK2023 from "../data/vertebrates/uk/fishingeffort_UK2023MONTHLY.json";
import fishingDataTromso2021 from "../data/vertebrates/tromso/fishingeffort_Tromso2021MONTHLY.json";
import fishingDataTromso2022 from "../data/vertebrates/tromso/fishingeffort_Tromso2022MONTHLY.json";
import fishingDataTromso2023 from "../data/vertebrates/tromso/fishingeffort_Tromso2023MONTHLY.json";

interface SeasonData {
  season: string;
  fishingHours: string;
  vesselActivity: string;
  change: string;
  trend: "up" | "down" | "stable";
}

interface SeasonalDataProps {
  region: string;
  year: string;
  month: string;
  vesselId: string;
  target: string;
  station?: string | null;
}

// Helper function to get fishing data by region, year, month, and vessel ID
const getFishingData = (region: string, year: string, month: string = "All Months", vesselId: string = "All Vessels") => {
  let data;
  
  // Select data based on region and year
  if (region === "UK") {
    switch (year) {
      case '2021': data = fishingDataUK2021; break;
      case '2022': data = fishingDataUK2022; break;
      case '2023': data = fishingDataUK2023; break;
      default: data = fishingDataUK2023;
    }
  } else if (region === "Tromso") {
    switch (year) {
      case '2021': data = fishingDataTromso2021; break;
      case '2022': data = fishingDataTromso2022; break;
      case '2023': data = fishingDataTromso2023; break;
      default: data = fishingDataTromso2023;
    }
  } else {
    data = fishingDataUK2023; // Default to UK
  }
  
  // Filter by month if not "All Months"
  if (month !== "All Months") {
    const monthNumber = month.padStart(2, '0'); // Convert "1" to "01", etc.
    data = data.filter(point => {
      const timeRange = point['Time Range'];
      const pointMonth = timeRange.split('-')[1];
      return pointMonth === monthNumber;
    });
  }
  
  // Filter by vessel ID if not "All Vessels"
  if (vesselId !== "All Vessels") {
    data = data.filter(point => {
      return point['Vessel IDs'].toString() === vesselId;
    });
  }
  
  return data;
};

// Helper function to calculate seasonal fishing effort
const calculateSeasonalEffort = (data: any[]) => {
  const seasons = {
    Spring: ['03', '04', '05'], // Mar, Apr, May
    Summer: ['06', '07', '08'], // Jun, Jul, Aug
    Fall: ['09', '10', '11'],   // Sep, Oct, Nov
    Winter: ['12', '01', '02']  // Dec, Jan, Feb
  };

  const seasonalStats: Record<string, SeasonData> = {};

  Object.entries(seasons).forEach(([seasonName, months]) => {
    const seasonData = data.filter(point => {
      const timeRange = point['Time Range'];
      const month = timeRange.split('-')[1];
      return months.includes(month);
    });

    const totalFishingHours = seasonData.reduce((sum, point) => sum + point['Apparent Fishing Hours'], 0);
    const avgVesselCount = seasonData.length > 0 
      ? seasonData.reduce((sum, point) => sum + point['Vessel IDs'], 0) / seasonData.length 
      : 0;

    // Calculate trend based on fishing hours
    let trend: "up" | "down" | "stable" = "stable";
    let change = "0%";
    
    if (seasonData.length > 0) {
      const avgHours = totalFishingHours / seasonData.length;
      if (avgHours > 150) {
        trend = "up";
        change = `+${Math.round((avgHours - 100) / 10)}%`;
      } else if (avgHours < 80) {
        trend = "down";
        change = `-${Math.round((100 - avgHours) / 10)}%`;
      }
    }

    seasonalStats[seasonName] = {
      season: seasonName,
      fishingHours: `${totalFishingHours.toFixed(0)} hrs`,
      vesselActivity: avgVesselCount > 0 ? `${avgVesselCount.toFixed(1)} avg` : "0 avg",
      change: change,
      trend: trend
    };
  });

  return Object.values(seasonalStats);
};

export function SeasonalData({ region, year, month, vesselId, target, station }: SeasonalDataProps) {
  // Get real fishing data for the selected year, month, and vessel ID
  const fishingData = getFishingData(region, year, month, vesselId);
  
  // Calculate seasonal effort from real data
  const seasonalEffort = calculateSeasonalEffort(fishingData);
  
  // Station-specific data adjustments
  const getStationData = (baseData: SeasonData[], stationName: string | null) => {
    if (!stationName) return baseData;
    
    // Find data for the specific station
    const stationData = fishingData.filter(point => {
      const stationKey = `Fishing Zone ${point.Lat.toFixed(1)}°N, ${point.Lon.toFixed(1)}°`;
      return stationKey === stationName;
    });
    
    if (stationData.length === 0) return baseData;
    
    // Calculate station-specific seasonal data
    const seasons = {
      Spring: ['03', '04', '05'],
      Summer: ['06', '07', '08'],
      Fall: ['09', '10', '11'],
      Winter: ['12', '01', '02']
    };
    
    return Object.entries(seasons).map(([seasonName, months]) => {
      const seasonData = stationData.filter(point => {
        const timeRange = point['Time Range'];
        const month = timeRange.split('-')[1];
        return months.includes(month);
      });
      
      const totalFishingHours = seasonData.reduce((sum, point) => sum + point['Apparent Fishing Hours'], 0);
      const avgVesselCount = seasonData.length > 0 
        ? seasonData.reduce((sum, point) => sum + point['Vessel IDs'], 0) / seasonData.length 
        : 0;
      
      let trend: "up" | "down" | "stable" = "stable";
      let change = "0%";
      
      if (seasonData.length > 0) {
        const avgHours = totalFishingHours / seasonData.length;
        if (avgHours > 150) {
          trend = "up";
          change = `+${Math.round((avgHours - 100) / 10)}%`;
        } else if (avgHours < 80) {
          trend = "down";
          change = `-${Math.round((100 - avgHours) / 10)}%`;
        }
      }
      
      return {
        season: seasonName,
        fishingHours: `${totalFishingHours.toFixed(0)} hrs`,
        vesselActivity: avgVesselCount > 0 ? `${avgVesselCount.toFixed(1)} avg` : "0 avg",
        change: change,
        trend: trend
      };
    });
  };
  
  const adjustedData = getStationData(seasonalEffort, station || null);
  
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
      {adjustedData.map((season, index) => (
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
              <span className="text-gray-600">Fishing Hours:</span>
              <span className="font-semibold">{season.fishingHours}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Vessel Activity:</span>
              <span className="font-semibold">{season.vesselActivity}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Change:</span>
              <span className={`font-semibold ${getTrendColor(season.trend)}`}>
                {season.change}
              </span>
            </div>
            <div className="mt-4 pt-3 border-t">
              <div className="text-sm text-gray-500">Analysis: {target}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
