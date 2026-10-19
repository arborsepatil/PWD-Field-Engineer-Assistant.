/* PWD Engineering Unit Registry — public factors, no project SSR rates.
 * All factors are SI base units per category unless noted.
 * Exact international yard/foot and SI definitions; contextual regional units
 * must never be silently treated as universal.
 */
(function(root){
'use strict';
const FT=0.3048,IN=0.0254,YD=0.9144,MI=1609.344,NAUTICAL_MILE=1852;
const SQFT=FT**2, ACRE=43560*SQFT, GUNTHA=ACRE/40, CENT=ACRE/100;
const CUFT=FT**3,USGALLON=0.003785411784,IMPGALLON=0.00454609;
const POUND=.45359237, STANDARD_G=9.80665;
const U={
 Length:{
  'mm':.001,'cm':.01,'m':1,'km':1000,'µm':1e-6,
  'in (inch)':IN,'ft (foot)':FT,'yd (yard)':YD,
  'mi (mile)':MI,'nmi (nautical mile)':NAUTICAL_MILE,
  'chain (66 ft)':66*FT,'link (0.66 ft)':.66*FT,
  'furlong':660*FT,'rod / pole':16.5*FT,'fathom':6*FT
 },
 Area:{
  'mm²':1e-6,'cm²':1e-4,'m²':1,'km²':1e6,
  'in²':IN**2,'ft²':SQFT,'yd²':YD**2,'mi² (square mile)':MI**2,
  'sq chain':(66*FT)**2,'sq rod / perch':(16.5*FT)**2,
  'sq link':(.66*FT)**2,
  'are (R)':100,'hectare (ha)':10000,
  'acre':ACRE,'guntha / gunta (MH)':GUNTHA,
  'cent / decimal / dismil':CENT,'gaj² / var (sq yd)':YD**2
 },
 Volume:{
  'mm³':1e-9,'cm³ / mL':1e-6,'m³':1,'km³':1e9,
  'litre (L)':.001,'kilolitre (kL)':1,'megalitre (ML)':1000,
  'in³':IN**3,'ft³':CUFT,'yd³':YD**3,
  'brass (100 ft³)':100*CUFT,'acre-ft':ACRE*FT,
  'US gallon':USGALLON,'Imperial gallon':IMPGALLON,
  'US fluid ounce':USGALLON/128,
  'US pint':USGALLON/8,'US quart':USGALLON/4
 },
 Mass:{
  'mg':1e-6,'g':.001,'kg':1,'quintal (100 kg)':100,
  'tonne (metric ton)':1000,'lb':POUND,'oz (avoirdupois)':POUND/16,
  'short ton (US)':2000*POUND,'long ton (UK)':2240*POUND,
  'stone (UK)':14*POUND
 },
 Density:{
  'kg/m³':1,'g/cm³':1000,'g/mL':1000,'kg/L':1000,
  't/m³':1000,'lb/ft³':POUND/CUFT,
  'lb/in³':POUND/IN**3
 },
 'Unit Weight':{
  'N/m³':1,'kN/m³':1000,'kgf/m³':STANDARD_G,
  'lbf/ft³':4.4482216152605/CUFT
 },
 Force:{
  'N':1,'kN':1000,'MN':1e6,'kgf':STANDARD_G,
  'gf':STANDARD_G/1000,'tonne-force (tf)':1000*STANDARD_G,
  'lbf':4.4482216152605,'kip (1000 lbf)':4448.2216152605
 },
 Pressure:{
  'Pa':1,'kPa':1000,'MPa':1e6,'GPa':1e9,
  'N/mm²':1e6,'kN/m²':1000,'N/cm²':10000,
  'bar':1e5,'mbar':100,'atm (standard)':101325,
  'kgf/cm²':STANDARD_G*10000,'psi':6894.757293168,
  'ksi':6894757.293168,'mmHg (conventional)':133.322387415,
  'mmH₂O (standard)':STANDARD_G,'mH₂O (standard)':1000*STANDARD_G,
  'ftH₂O (standard)':FT*1000*STANDARD_G
 },
 'Moment / Torque':{
  'N·mm':.001,'N·m':1,'kN·mm':1,'kN·m':1000,
  'MN·m':1e6,'kgf·m':STANDARD_G,
  'lbf·ft':4.4482216152605*FT,'lbf·in':4.4482216152605*IN
 },
 'Speed / Velocity':{
  'mm/s':.001,'cm/s':.01,'m/s':1,'m/min':1/60,
  'km/h':1/3.6,'ft/s':FT,'ft/min':FT/60,
  'mph':MI/3600,'knot':NAUTICAL_MILE/3600
 },
 Acceleration:{
  'm/s²':1,'cm/s²':.01,'ft/s²':FT,'g (standard)':STANDARD_G
 },
 Discharge:{
  'L/s':.001,'L/min':.001/60,'L/hr':.001/3600,
  'm³/s':1,'m³/min':1/60,'m³/hr':1/3600,
  'cumec':1,'cusec':CUFT,
  'MLD':1000/86400,'ML/day':1000/86400,
  'US gal/min (gpm)':USGALLON/60,'US MGD':USGALLON*1e6/86400,
  'Imperial gal/min':IMPGALLON/60
 },
 'Mass Flow':{
  'kg/s':1,'kg/min':1/60,'kg/hr':1/3600,'kg/day':1/86400,
  'g/s':.001,'t/hr':1000/3600,'lb/s':POUND,'lb/hr':POUND/3600
 },
 Time:{
  'ms':.001,'s':1,'min':60,'hr':3600,'day':86400,'week':604800,
  'year (365 days)':31536000
 },
 Energy:{
  'J':1,'kJ':1000,'MJ':1e6,'GJ':1e9,'Wh':3600,
  'kWh':3.6e6,'MWh':3.6e9,
  'cal (thermochemical)':4.184,'kcal':4184,
  'BTU (IT)':1055.05585262,
  'ft·lbf':4.4482216152605*FT
 },
 Power:{
  'W':1,'kW':1000,'MW':1e6,
  'hp (mechanical)':745.69987158227,
  'PS (metric hp)':STANDARD_G*75,
  'BTU/hr (IT)':1055.05585262/3600
 },
 Frequency:{
  'Hz':1,'kHz':1000,'MHz':1e6,'rpm':1/60
 },
 Angle:{
  'degree':Math.PI/180,'radian':1,'grad / gon':Math.PI/200,
  'arcminute':Math.PI/10800,'arcsecond':Math.PI/648000
 },
 'Dynamic Viscosity':{
  'Pa·s':1,'mPa·s':.001,'cP':.001,'poise (P)':.1
 },
 'Kinematic Viscosity':{
  'm²/s':1,'cm²/s':1e-4,'mm²/s':1e-6,'cSt':1e-6,'stokes (St)':1e-4
 },
 'Permeability / Hydraulic Conductivity':{
  'mm/s':.001,'cm/s':.01,'m/s':1,'m/day':1/86400,
  'ft/day':FT/86400
 },
 'Rainfall Intensity':{
  'mm/hr':1,'mm/day':1/24,'cm/hr':10,'in/hr':25.4,
  'in/day':25.4/24,'m/s':3.6e6
 },
 'Linear Load':{
  'N/m':1,'kN/m':1000,'N/mm':1000,
  'kgf/m':STANDARD_G,'lbf/ft':4.4482216152605/FT
 },
 'Stiffness / Force per Length':{
  'N/mm':1,'kN/mm':1000,'N/m':.001,'kN/m':1,
  'lbf/in':4.4482216152605/IN/1000
 },
 'Moment of Inertia (Area)':{
  'mm⁴':1e-12,'cm⁴':1e-8,'m⁴':1,
  'in⁴':IN**4,'ft⁴':FT**4
 },
 'Section Modulus':{
  'mm³':1e-9,'cm³':1e-6,'m³':1,
  'in³':IN**3,'ft³':FT**3
 },
 'Surface Tension':{
  'N/m':1,'mN/m':.001,'dyn/cm':.001
 },
 'Thermal Conductivity':{
  'W/(m·K)':1,'W/(cm·K)':100,
  'kcal/(hr·m·K)':4184/3600,
  'BTU/(hr·ft·°F)':1055.05585262/(3600*FT*(5/9))
 },
 'Specific Heat Capacity':{
  'J/(kg·K)':1,'kJ/(kg·K)':1000,
  'cal/(g·°C)':4184,'kcal/(kg·°C)':4184,
  'BTU/(lb·°F)':1055.05585262/(POUND*(5/9))
 },
 'Temperature Difference':{
  'Δ°C':1,'ΔK':1,'Δ°F':5/9,'Δ°R':5/9
 },
 'Electric Current':{
  'µA':1e-6,'mA':.001,'A':1,'kA':1000
 },
 Voltage:{
  'mV':.001,'V':1,'kV':1000
 },
 'Electrical Resistance':{
  'mΩ':.001,'Ω':1,'kΩ':1000,'MΩ':1e6
 }
};
const NOTES={
 Area:'International foot/yard/mile convention; 1 mi² = 640 acres. Maharashtra: 1 guntha = 1,089 ft² = 1/40 acre; 1 are = 100 m². “Cent / decimal / dismil” = 1/100 acre; gaj/var here means square yard. Bigha, biswa, katha and local marla/kanal conventions vary by region and are deliberately excluded. Use official survey records for land boundaries.',
 Volume:'Maharashtra brass = 100 ft³. US and Imperial gallons differ and are explicitly distinguished.',
 Length:'Uses international foot (0.3048 m), international statute mile (1,609.344 m) and nautical mile (1,852 m). Legacy US survey-foot definitions are not silently substituted.',
 Pressure:'Water-column conversions assume water density 1,000 kg/m³ and standard gravity 9.80665 m/s²; actual fluid and temperature affect pressure.',
 'Unit Weight':'Uses standard gravity 9.80665 m/s²; distinguish mass density from unit weight.',
 'Temperature Difference':'These are interval conversions; for absolute temperatures select Temperature instead.',
 Time:'Year (365 days) is an explicit fixed-length approximation; calendar years vary.',
 Energy:'Calorie is thermochemical; BTU is the international-table BTU.',
 'Specific Heat Capacity':'Temperature units represent intervals; degree Celsius and Kelvin increments have equal magnitude.',
 'Rainfall Intensity':'Rainfall depth/time, not the same quantity as discharge; choose the appropriate catchment and time unit.'
};
function temperature(value,from,to){
 const absolute={C:value,F:(value-32)*5/9,K:value-273.15,R:value*5/9-273.15};
 if(!Number.isFinite(value)||!(from in absolute))return NaN;
 const c=absolute[from];
 if(c< -273.15-1e-10)return NaN;
 if(to==='C')return c;
 if(to==='F')return c*9/5+32;
 if(to==='K')return c+273.15;
 if(to==='R')return (c+273.15)*9/5;
 return NaN;
}
function convert(category,value,from,to){
 if(!Number.isFinite(value))return NaN;
 if(category==='Temperature')return temperature(value,from,to);
 const factors=U[category];
 if(!factors||!Number.isFinite(factors[from])||!Number.isFinite(factors[to]))return NaN;
 return value*factors[from]/factors[to];
}
function format(value){
 if(!Number.isFinite(value))return '—';
 if(value===0)return '0';
 if(Math.abs(value)<1e-7||Math.abs(value)>=1e12)
   return value.toExponential(7).replace('e+','e+');
 return Number(value.toPrecision(12)).toLocaleString('en-IN',{maximumFractionDigits:10});
}
root.PWDUnitData={U,NOTES,temperature,convert,format,
 temperatureUnits:{C:'°C (Celsius)',F:'°F (Fahrenheit)',K:'K (Kelvin)',R:'°R (Rankine)'}};
})(typeof window!=='undefined'?window:globalThis);