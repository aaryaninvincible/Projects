import re
import json
from shapely.geometry import shape, Polygon

def check_overlaps(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract ZONES_GEO object
    match = re.search(r'const ZONES_GEO = ({.*?});', content, re.DOTALL)
    if not match:
        print("Could not find ZONES_GEO in index.html")
        return

    zones_geo_str = match.group(1)
    # The JS object syntax isn't strict JSON (keys aren't quoted), so we need to fix it or use a lenient parser.
    # Simple fix: wrap unquoted keys in quotes.
    # Or just use the coordinates directly.
    
    # Let's try to extract features array specifically to avoid parsing the whole JS object
    features_match = re.search(r'features: \[(.*?)\]', zones_geo_str, re.DOTALL)
    if not features_match:
        print("Could not find features array")
        return

    # It's easier to just paste the coordinates into this script if valid JSON is hard to extract from JS.
    # But let's try to parse the JS object with a simple regex replacer.
    json_str = zones_geo_str
    # Quote keys
    json_str = re.sub(r'(\w+):', r'"\1":', json_str)
    # Remove trailing commas
    json_str = re.sub(r',\s*([\]}])', r'\1', json_str)
    # Convert single quotes to double quotes for string values
    json_str = json_str.replace("'", '"')
    
    try:
        zones_geo = json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"JSON Parse Error: {e}")
        print("Snippet:", json_str[:500])
        return

    polygons = {}
    for feature in zones_geo['features']:
        fid = feature['properties']['id']
        geom = feature['geometry']
        poly = shape(geom)
        if not poly.is_valid:
            print(f"Zone {fid} is invalid: {poly.explain_validity}")
            poly = poly.buffer(0)
        polygons[fid] = poly

    print(f"Loaded {len(polygons)} polygons.")

    ids = sorted(polygons.keys())
    for i in range(len(ids)):
        for j in range(i + 1, len(ids)):
            id1 = ids[i]
            id2 = ids[j]
            p1 = polygons[id1]
            p2 = polygons[id2]

            if p1.intersects(p2) and not p1.touches(p2):
                intersection = p1.intersection(p2)
                if intersection.area > 1e-6: # Ignore tiny overlaps due to FP precision
                    print(f"Overlap detected between Zone {id1} and Zone {id2}. Area: {intersection.area}")

if __name__ == "__main__":
    check_overlaps(r'c:\Users\aryan\OneDrive\Documents\GitHub\Projects\Sudhanshu\index.html')
