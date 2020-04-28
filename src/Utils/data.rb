require 'json'
us = File.open "USA.geo.json"
world = File.open "countries.geo.json"

us_data = JSON.load us
world_data = JSON.load world

world_data['features'].delete_if{|j| j['properties']['brk_name'] == 'United States'}

# world_data['features'].each{|n| 
#     if n['properties']['brk_name'] == 'United States'
#         puts('Found')
#     end
# }

us_data['features'].each{|n| n['properties']['gdp_md_est'] = 0}

combine_hash = us_data['features'].concat(world_data['features']) 

File.write("CombinedGeoData.json",combine_hash.to_json)
