require_relative "./data_loader"

class DangerousDenver
  attr_reader :filepath
  attr_accessor :incidents, :results

  def initialize()
    @incidents = []
    @results = {}
  end

  def load_traffic_data(type)
    if type == "traffic"
      filepath = "./data/traffic-accidents.csv"
    else
      filepath = "./data/crime.csv"
    end
    DataLoader.open_file(filepath).each do |row|
      incidents << {id: row[:incident_id],
                    incident_address: row[:incident_address],
                    neighborhood_id: row[:neighborhood_id],
                    offense_category_id: row[:offense_category_id]}
    end
  end

  def sort_by_frequency(data)
    if results[:"#{data}"]
      results[:"#{data}"] += 1
    else
      results[:"#{data}"] = 1
    end
  end

  def sort_data(data_type, data_key)
    load_traffic_data(data_type)
    incidents.each do |incident|
      if incident[:"#{data_key}"] &&
         (!(data_type == "crime" &&
         incident[:offense_category_id] == "traffic-accident"))
        sort_by_frequency(incident[:"#{data_key}"])
      end
    end
    sorted_results = results.max_by(5) { |k, v| v }
    puts sorted_results
  end
end

puts "Traffic accidents by address: "
DangerousDenver.new().sort_data("traffic", "incident_address")
puts "Traffic accidents by neighborhood: "
DangerousDenver.new().sort_data("traffic", "neighborhood_id")
puts "Crime by neighborhood: "
DangerousDenver.new().sort_data("crime", "neighborhood_id")
