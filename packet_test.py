from scapy.all import *

# TODO: modify filter
packets = sniff(filter="tcp", count=3)

for pkt in packets:
    try:
        payload = pkt.load
        # TODO: decode byte?
        print(f"Packet data:\n{payload}")
    except (ValueError, AttributeError):
        print("Could not retrieve packet payload data.")
