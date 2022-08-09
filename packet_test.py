from scapy.all import *

# TODO: modify filter
packets = sniff(filter="src host 24.84.201.182 dst host 54.152.195.135", count=3)

for pkt in packets:
    try:
        payload = pkt.load
        # TODO: decode byte?
        print(f"Packet data:\n{payload}")
    except (ValueError, AttributeError):
        print("Could not retrieve packet payload data.")
