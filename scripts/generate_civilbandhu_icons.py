#!/usr/bin/env python3
"""Create CivilBandhu PNG web icons from the same CB/bridge geometry as the vector logo.

Zero external dependencies. Generate during public web and Android asset packaging;
never reuse historical PWD Tools raster icons in published builds.
"""
import math
import struct
import sys
import zlib
from pathlib import Path

BLUE=(23,79,135)
WHITE=(255,255,255)
PALE=(174,232,243)

def segment_distance(x,y,x1,y1,x2,y2):
    dx,dy=x2-x1,y2-y1
    if dx==dy==0: return math.hypot(x-x1,y-y1)
    t=max(0,min(1,((x-x1)*dx+(y-y1)*dy)/(dx*dx+dy*dy)))
    return math.hypot(x-(x1+t*dx),y-(y1+t*dy))

def filled_arc(x,y,cx,cy,rx,ry,stroke=3.5):
    vx,vy=(x-cx)/rx,(y-cy)/ry
    angle=math.atan2(vy,vx)
    return abs(math.hypot(vx,vy)-1)*min(rx,ry) <= stroke and -1.55<=angle<=1.55

def pixel(x,y):
    # Rounded square at 2..106, 22 unit corner radius.
    dx=max(abs(x-54)-30,0)
    dy=max(abs(y-54)-30,0)
    if math.hypot(dx,dy)>22 or abs(x-54)>52 or abs(y-54)>52:
        return None
    colour=BLUE
    # C: open right, uniformly stroked ellipse.
    ax,ay=(x-35)/16.9,(y-52.7)/18
    if abs(math.atan2(ay,ax))>.8 and abs(math.hypot(ax,ay)-1)*17.4<3.7:
        colour=WHITE
    # B: vertical stem and two bowls (top and lower right).
    if segment_distance(x,y,56,35,56,71)<=3.65:
        colour=WHITE
    if segment_distance(x,y,57,36,67,36)<=3.55 or segment_distance(x,y,57,52,70,52)<=3.55 or segment_distance(x,y,57,70,68,70)<=3.55:
        colour=WHITE
    if filled_arc(x,y,68,44,10,8.2,3.65) or filled_arc(x,y,68,61,11,9,3.65):
        colour=WHITE
    # Bridge under the monogram: deck, arch and posts.
    if segment_distance(x,y,16,87,92,87)<=1.65:
        colour=PALE
    if 25<=x<=83 and abs(y-(76+11*((x-54)/29)**2))<=1.8:
        colour=PALE
    if (segment_distance(x,y,25,87,25,93)<=1.65 or segment_distance(x,y,83,87,83,93)<=1.65):
        colour=PALE
    return colour

def png(size):
    lines=[]
    for y in range(size):
        scan=bytearray([0])  # RGBA filter: none
        for x in range(size):
            rgb=[0,0,0]; count=0
            # 2x supersampling for crisp mobile launcher edges.
            for sy in (.25,.75):
                for sx in (.25,.75):
                    c=pixel((x+sx)*108/size,(y+sy)*108/size)
                    if c is not None:
                        count+=1
                        for i in range(3): rgb[i]+=c[i]
            a=round(count*255/4)
            if count: scan.extend([*(round(v/count) for v in rgb),a])
            else: scan.extend((0,0,0,0))
        lines.append(bytes(scan))
    def chunk(tag,data):
        return struct.pack('>I',len(data))+tag+data+struct.pack('>I',zlib.crc32(tag+data)&0xffffffff)
    return (b'\x89PNG\r\n\x1a\n'
        +chunk(b'IHDR',struct.pack('>IIBBBBB',size,size,8,6,0,0,0))
        +chunk(b'IDAT',zlib.compress(b''.join(lines),9))
        +chunk(b'IEND',b''))

def main():
    if len(sys.argv)!=2: raise SystemExit('Usage: generate_civilbandhu_icons.py OUTPUT_DIRECTORY')
    output=Path(sys.argv[1])
    output.mkdir(parents=True,exist_ok=True)
    for size in (192,512):
        path=output/f'icon-{size}.png'
        path.write_bytes(png(size))
        print(f'CivilBandhu icon: {path.name} ({path.stat().st_size} bytes)')
if __name__=='__main__':main()
