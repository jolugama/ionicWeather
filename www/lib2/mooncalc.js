// http://lexikon.astronomie.info/java/sunmoon/index.html


(function () {
  //"use strict";

  var pi = Math.PI,
  DEG = pi/180.0,
  RAD = 180./pi;


  function sqr(x)
  {
    return x*x;
  }


  // return integer value, closer to 0
  function Int(x)
  {
    if (x<0) { return(Math.ceil(x)); } else return(Math.floor(x));
  }

  function frac(x) { return(x-Math.floor(x)); }

  function Mod(a, b) { return(a-Math.floor(a/b)*b); }


  // Modulo PI
  function Mod2Pi(x)
  {
    x = Mod(x, 2.*pi);
    return(x);
  }


  function round100000(x) { return(Math.round(100000.*x)/100000.); }
  function round10000(x) { return(Math.round(10000.*x)/10000.); }
  function round1000(x) { return(Math.round(1000.*x)/1000.); }
  function round100(x) { return(Math.round(100.*x)/100.); }
  function round10(x) { return(Math.round(10.*x)/10.); }


  var empty = "--";

  function HHMM(hh)
  {
    if (hh==0) return(empty);

    m = frac(hh)*60.;
    var h = Int(hh);
    if (m>=59.5) { h++; m -=60.; }
    m = Math.round(m);
    if (h<10) h = "0"+h;
    h = h+":";
    if (m<10) h = h+"0";
    h = h+m;
    //return(h+" = "+round1000(hh));
    return(h);
  }

  function HHMMSS(hh)
  {
    if (hh==0) return(empty);

    m = frac(hh)*60;
    var h = Int(hh);
    s = frac(m)*60.;
    m = Int(m);
    if (s>=59.5) { m++; s -=60.; }
    if (m>=60)   { h++; m -=60; }
    s = Math.round(s);
    if (h<10) h = "0"+h;
    h = h+":";
    if (m<10) h = h+"0";
    h = h+m+":";
    if (s<10) h = h+"0";
    h = h+s;
    return(h+" = "+round10000(hh));
  }


  function Sign(lon)
  {
    var signs= new Array("Widder", "Stier", "Zwillinge", "Krebs", "L�we", "Jungfrau",
    "Waage", "Skorpion", "Sch�tze", "Steinbock", "Wassermann", "Fische");
    return( signs[Math.floor(lon*RAD/30)] );
  }


  // Calculate Julian date: valid only from 1.3.1901 to 28.2.2100
  function CalcJD(day,month,year)
  {
    var jd = 2415020.5-64; // 1.1.1900 - correction of algorithm
    if (month<=2) { year--; month += 12; }
    jd += Int( (year-1900)*365.25 );
    jd += Int( 30.6001*(1+month) );
    return(jd + day);
  }


  // Julian Date to Greenwich Mean Sidereal Time
  function GMST(JD)
  {
    var UT = frac(JD-0.5)*24.; // UT in hours
    JD = Math.floor(JD-0.5)+0.5;   // JD at 0 hours UT
    var T = (JD-2451545.0)/36525.0;
    var T0 = 6.697374558 + T*(2400.051336 + T*0.000025862);
    return(Mod(T0+UT*1.002737909, 24.));
  }


  // Convert Greenweek mean sidereal time to UT
  function GMST2UT(JD, gmst)
  {
    JD = Math.floor(JD-0.5)+0.5;   // JD at 0 hours UT
    var T = (JD-2451545.0)/36525.0;
    var T0 = Mod(6.697374558 + T*(2400.051336 + T*0.000025862), 24.);
    //var UT = 0.9972695663*Mod((gmst-T0), 24.);
    var UT = 0.9972695663*((gmst-T0));
    return(UT);
  }


  // Local Mean Sidereal Time, geographical longitude in radians, East is positive
  function GMST2LMST(gmst, lon)
  {
    var lmst = Mod(gmst+RAD*lon/15, 24.);
    return( lmst );
  }


  // Transform ecliptical coordinates (lon/lat) to equatorial coordinates (RA/dec)
  function Ecl2Equ(coor, TDT)
  {
    T = (TDT-2451545.0)/36525.; // Epoch 2000 January 1.5
    eps = (23.+(26+21.45/60.)/60. + T*(-46.815 +T*(-0.0006 + T*0.00181) )/3600. )*DEG;
    var coseps = Math.cos(eps);
    var sineps = Math.sin(eps);

    var sinlon = Math.sin(coor.lon);
    coor.ra  = Mod2Pi( Math.atan2( (sinlon*coseps-Math.tan(coor.lat)*sineps), Math.cos(coor.lon) ) );
    coor.dec = Math.asin( Math.sin(coor.lat)*coseps + Math.cos(coor.lat)*sineps*sinlon );

    return coor;
  }


  // Transform equatorial coordinates (RA/Dec) to horizonal coordinates (azimuth/altitude)
  // Refraction is ignored
  function Equ2Altaz(coor, TDT, geolat, lmst)
  {
    var cosdec = Math.cos(coor.dec);
    var sindec = Math.sin(coor.dec);
    var lha = lmst - coor.ra;
    var coslha = Math.cos(lha);
    var sinlha = Math.sin(lha);
    var coslat = Math.cos(geolat);
    var sinlat = Math.sin(geolat);

    var N = -cosdec * sinlha;
    var D = sindec * coslat - cosdec * coslha * sinlat;
    //coor.az = Mod2Pi( Math.atan2(N, D) ); // Azimuth Horizontalwinkel Original in Bogenmass 0 - 6.283
    coor.myaz = Mod2Pi(Math.atan2(N, D)) - 3.142 ; // Azimuth Horizontalwinkel in Bogenmass -180 - 180
    coor.alt = Math.asin( sindec * sinlat + cosdec * coslha * coslat ); // Altitide Hoehenwinkel

    return coor;
  }


  // Transform geocentric equatorial coordinates (RA/Dec) to topocentric equatorial coordinates
  function GeoEqu2TopoEqu(coor, observer, lmst)
  {
    var cosdec = Math.cos(coor.dec);
    var sindec = Math.sin(coor.dec);
    var coslst = Math.cos(lmst);
    var sinlst = Math.sin(lmst);
    var coslat = Math.cos(observer.lat); // we should use geocentric latitude, not geodetic latitude
    var sinlat = Math.sin(observer.lat);
    var rho = observer.radius; // observer-geocenter in Kilometer

    var x = coor.distance*cosdec*Math.cos(coor.ra) - rho*coslat*coslst;
    var y = coor.distance*cosdec*Math.sin(coor.ra) - rho*coslat*sinlst;
    var z = coor.distance*sindec - rho*sinlat;

    coor.distanceTopocentric = Math.sqrt(x*x + y*y + z*z);
    coor.decTopocentric = Math.asin(z/coor.distanceTopocentric);
    coor.raTopocentric = Mod2Pi( Math.atan2(y, x) );

    return coor;
  }


  // Calculate cartesian from polar coordinates
  function EquPolar2Cart( lon, lat, distance )
  {
    var cart = new Object();
    rcd = Math.cos(lat)*distance;
    cart.x = rcd*Math.cos(lon);
    cart.y = rcd*Math.sin(lon);
    cart.z = distance * Math.sin(lat);
    return(cart);
  }


  // Calculate observers cartesian equatorial coordinates (x,y,z in celestial frame)
  // from geodetic coordinates (longitude, latitude, height above WGS84 ellipsoid)
  // Currently only used to calculate distance of a body from the observer
  function Observer2EquCart( lon, lat, height, gmst )
  {
    flat = 298.257223563;        // WGS84 flatening of earth
    aearth = 6378.137;           // GRS80/WGS84 semi major axis of earth ellipsoid
    var cart = new Object();
    // Calculate geocentric latitude from geodetic latitude
    co = Math.cos (lat);
    si = Math.sin (lat);
    fl = 1.0 - 1.0 / flat;
    fl = fl * fl;
    si = si * si;
    u = 1.0 / Math.sqrt (co * co + fl * si);
    a = aearth * u + height;
    b = aearth * fl * u + height;
    radius = Math.sqrt (a * a * co * co + b * b * si); // geocentric distance from earth center
    cart.y = Math.acos (a * co / radius); // geocentric latitude, rad
    cart.x = lon; // longitude stays the same
    if (lat < 0.0) { cart.y = -cart.y; } // adjust sign
    cart = EquPolar2Cart( cart.x, cart.y, radius ); // convert from geocentric polar to geocentric cartesian, with regard to Greenwich
    // rotate around earth's polar axis to align coordinate system from Greenwich to vernal equinox
    x=cart.x; y=cart.y;
    rotangle = gmst/24*2*pi; // sideral time gmst given in hours. Convert to radians
    cart.x = x*Math.cos(rotangle)-y*Math.sin(rotangle);
    cart.y = x*Math.sin(rotangle)+y*Math.cos(rotangle);
    cart.radius = radius;
    cart.lon = lon;
    cart.lat = lat;
    return(cart);
  }


  // Calculate coordinates for Sun
  // Coordinates are accurate to about 10s (right ascension)
  // and a few minutes of arc (declination)
  function SunPosition(TDT, geolat, lmst)
  {
    var D = TDT-2447891.5;

    var eg = 279.403303*DEG;
    var wg = 282.768422*DEG;
    var e  = 0.016713;
    var a  = 149598500; // km
    var diameter0 = 0.533128*DEG; // angular diameter of Moon at a distance

    var MSun = 360*DEG/365.242191*D+eg-wg;
    var nu = MSun + 360.*DEG/pi*e*Math.sin(MSun);

    var sunCoor = new Object();
    sunCoor.lon =  Mod2Pi(nu+wg);
    sunCoor.lat = 0;
    sunCoor.anomalyMean = MSun;

    sunCoor.distance = (1-sqr(e))/(1+e*Math.cos(nu)); // distance in astronomical units
    sunCoor.diameter = diameter0/sunCoor.distance; // angular diameter in radians
    sunCoor.distance *= a;                         // distance in km
    sunCoor.parallax = 6378.137/sunCoor.distance;  // horizonal parallax

    sunCoor = Ecl2Equ(sunCoor, TDT);

    // Calculate horizonal coordinates of sun, if geographic positions is given
    if (geolat!=null && lmst!=null) {
      sunCoor = Equ2Altaz(sunCoor, TDT, geolat, lmst);
    }

    sunCoor.sign = Sign(sunCoor.lon);
    return sunCoor;
  }


  // Calculate data and coordinates for the Moon
  // Coordinates are accurate to about 1/5 degree (in ecliptic coordinates)
  function MoonPosition(sunCoor, TDT, observer, lmst)
  {
    var D = TDT-2447891.5;

    // Mean Moon orbit elements as of 1990.0
    var l0 = 318.351648*DEG;
    var P0 =  36.340410*DEG;
    var N0 = 318.510107*DEG;
    var i  = 5.145396*DEG;
    var e  = 0.054900;
    var a  = 384401; // km
    var diameter0 = 0.5181*DEG; // angular diameter of Moon at a distance
    var parallax0 = 0.9507*DEG; // parallax at distance a

    var l = 13.1763966*DEG*D+l0;
    var MMoon = l-0.1114041*DEG*D-P0; // Moon's mean anomaly M
    var N = N0-0.0529539*DEG*D;       // Moon's mean ascending node longitude
    var C = l-sunCoor.lon;
    var Ev = 1.2739*DEG*Math.sin(2*C-MMoon);
    var Ae = 0.1858*DEG*Math.sin(sunCoor.anomalyMean);
    var A3 = 0.37*DEG*Math.sin(sunCoor.anomalyMean);
    var MMoon2 = MMoon+Ev-Ae-A3;  // corrected Moon anomaly
    var Ec = 6.2886*DEG*Math.sin(MMoon2);  // equation of centre
    var A4 = 0.214*DEG*Math.sin(2*MMoon2);
    var l2 = l+Ev+Ec-Ae+A4; // corrected Moon's longitude
    var V = 0.6583*DEG*Math.sin(2*(l2-sunCoor.lon));
    var l3 = l2+V; // true orbital longitude;

    var N2 = N-0.16*DEG*Math.sin(sunCoor.anomalyMean);

    var moonCoor = new Object();
    moonCoor.lon = Mod2Pi( N2 + Math.atan2( Math.sin(l3-N2)*Math.cos(i), Math.cos(l3-N2) ) );
    moonCoor.lat = Math.asin( Math.sin(l3-N2)*Math.sin(i) );
    moonCoor.orbitLon = l3;

    moonCoor = Ecl2Equ(moonCoor, TDT);
    // relative distance to semi mayor axis of lunar oribt
    moonCoor.distance = (1-sqr(e)) / (1+e*Math.cos(MMoon2+Ec) );
    moonCoor.diameter = diameter0/moonCoor.distance; // angular diameter in radians
    moonCoor.parallax = parallax0/moonCoor.distance; // horizontal parallax in radians
    moonCoor.distance *= a; // distance in km

    // Calculate horizonal coordinates of sun, if geographic positions is given
    if (observer!=null && lmst!=null) {
      // transform geocentric coordinates into topocentric (==observer based) coordinates
      moonCoor = GeoEqu2TopoEqu(moonCoor, observer, lmst);
      moonCoor.raGeocentric = moonCoor.ra; // backup geocentric coordinates
      moonCoor.decGeocentric = moonCoor.dec;
      moonCoor.ra=moonCoor.raTopocentric;
      moonCoor.dec=moonCoor.decTopocentric;
      moonCoor = Equ2Altaz(moonCoor, TDT, observer.lat, lmst); // now ra and dec are topocentric
    }

    // Age of Moon in radians since New Moon (0) - Full Moon (pi)
    moonCoor.moonAge = Mod2Pi(l3-sunCoor.lon);
    moonCoor.phase   = 0.5*(1-Math.cos(moonCoor.moonAge)); // Moon phase, 0-1

    var phases = new Array("New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous",
    "Full Moon", "Waning Gibbous", "Third Quarter", "Waning Crescent", "New Moon");
    var mainPhase = 1./29.53*360*DEG; // show 'Newmoon, 'Quarter' for +/-1 day arond the actual event
    var p = Mod(moonCoor.moonAge, 90.*DEG);
    if (p < mainPhase || p > 90*DEG-mainPhase) p = 2*Math.round(moonCoor.moonAge / (90.*DEG));
    else p = 2*Math.floor(moonCoor.moonAge / (90.*DEG))+1;
    moonCoor.moonPhase = phases[p];

    moonCoor.sign = Sign(moonCoor.lon);

    return(moonCoor);
  }


  // Rough refraction formula using standard atmosphere: 1015 mbar and 10�C
  // Input true altitude in radians, Output: increase in altitude in degrees
  function Refraction(alt)
  {
    var altdeg = alt*RAD;
    if (altdeg<-2 || altdeg>=90) return(0);

    var pressure    = 1015;
    var temperature = 10;
    if (altdeg>15) return( 0.00452*pressure/( (273+temperature)*Math.tan(alt)) );

    var y = alt;
    var D = 0.0;
    var P = (pressure-80.)/930.;
    var Q = 0.0048*(temperature-10.);
    var y0 = y;
    var D0 = D;

    for (i=0; i<3; i++) {
      N = y+(7.31/(y+4.4));
      N = 1./Math.tan(N*DEG);
      D = N*P/(60.+Q*(N+39.));
      N = y-y0;
      y0 = D-D0-N;
      if ((N != 0.) && (y0 != 0.)) { N = y-N*(alt+D-y)/y0; }
      else { N = alt+D; }
      y0 = y;
      D0 = D;
      y = N;
    }
    return( D ); // Hebung durch Refraktion in radians
  }


  // returns Greenwich sidereal time (hours) of time of rise
  // and set of object with coordinates coor.ra/coor.dec
  // at geographic position lon/lat (all values in radians)
  // Correction for refraction and semi-diameter/parallax of body is taken care of in function RiseSet
  // h is used to calculate the twilights. It gives the required elevation of the disk center of the sun
  function GMSTRiseSet(coor, lon, lat, h)
  {
    var h = (h == null) ? 0. : h; // set default value
    var riseset = new Object();
    //  var tagbogen = Math.acos(-Math.tan(lat)*Math.tan(coor.dec)); // simple formula if twilight is not required
    var tagbogen = Math.acos((Math.sin(h) - Math.sin(lat)*Math.sin(coor.dec)) / (Math.cos(lat)*Math.cos(coor.dec)));

    riseset.transit =     RAD/15*(         +coor.ra-lon);
    riseset.rise    = 24.+RAD/15*(-tagbogen+coor.ra-lon); // calculate GMST of rise of object
    riseset.set     =     RAD/15*(+tagbogen+coor.ra-lon); // calculate GMST of set of object

    // using the modulo function Mod, the day number goes missing. This may get a problem for the moon
    riseset.transit = Mod(riseset.transit, 24);
    riseset.rise    = Mod(riseset.rise, 24);
    riseset.set     = Mod(riseset.set, 24);

    return(riseset);
  }


  // Find GMST of rise/set of object from the two calculates
  // (start)points (day 1 and 2) and at midnight UT(0)
  function InterpolateGMST(gmst0, gmst1, gmst2, timefactor)
  {
    return( (timefactor*24.07*gmst1- gmst0*(gmst2-gmst1)) / (timefactor*24.07+gmst1-gmst2) );
  }


  // JD is the Julian Date of 0h UTC time (midnight)
  function RiseSet(jd0UT, coor1, coor2, lon, lat, timeinterval, altitude)
  {
    // altitude of sun center: semi-diameter, horizontal parallax and (standard) refraction of 34'
    var alt = 0.; // calculate
    var altitude = (altitude == null) ? 0. : altitude; // set default value

    // true height of sun center for sunrise and set calculation. Is kept 0 for twilight (ie. altitude given):
    if (!altitude) alt = 0.5*coor1.diameter-coor1.parallax+34./60*DEG;

    var rise1 = GMSTRiseSet(coor1, lon, lat, altitude);
    var rise2 = GMSTRiseSet(coor2, lon, lat, altitude);

    var rise = new Object();

    // unwrap GMST in case we move across 24h -> 0h
    if (rise1.transit > rise2.transit && Math.abs(rise1.transit-rise2.transit)>18) rise2.transit += 24;
    if (rise1.rise    > rise2.rise    && Math.abs(rise1.rise   -rise2.rise)>18)    rise2.rise += 24;
    if (rise1.set     > rise2.set     && Math.abs(rise1.set    -rise2.set)>18)     rise2.set  += 24;
    var T0 = GMST(jd0UT);
    //  var T02 = T0-zone*1.002738; // Greenwich sidereal time at 0h time zone (zone: hours)

    // Greenwich sidereal time for 0h at selected longitude
    var T02 = T0-lon*RAD/15*1.002738; if (T02 < 0) T02 += 24;

    if (rise1.transit < T02) { rise1.transit += 24; rise2.transit += 24; }
    if (rise1.rise    < T02) { rise1.rise    += 24; rise2.rise    += 24; }
    if (rise1.set     < T02) { rise1.set     += 24; rise2.set     += 24; }

    // Refraction and Parallax correction
    var decMean = 0.5*(coor1.dec+coor2.dec);
    var psi = Math.acos(Math.sin(lat)/Math.cos(decMean));
    var y = Math.asin(Math.sin(alt)/Math.sin(psi));
    var dt = 240*RAD*y/Math.cos(decMean)/3600; // time correction due to refraction, parallax

    rise.transit = GMST2UT( jd0UT, InterpolateGMST( T0, rise1.transit, rise2.transit, timeinterval) );
    rise.rise    = GMST2UT( jd0UT, InterpolateGMST( T0, rise1.rise,    rise2.rise,    timeinterval) -dt );
    rise.set     = GMST2UT( jd0UT, InterpolateGMST( T0, rise1.set,     rise2.set,     timeinterval) +dt );

    return(rise);
  }


  // Find (local) time of sunrise and sunset, and twilights
  // JD is the Julian Date of 0h local time (midnight)
  // Accurate to about 1-2 minutes
  // recursive: 1 - calculate rise/set in UTC in a second run
  // recursive: 0 - find rise/set on the current local day. This is set when doing the first call to this function
  function SunRise(JD, deltaT, lon, lat, zone, recursive)
  {
    var jd0UT = Math.floor(JD-0.5)+0.5;   // JD at 0 hours UT
    var coor1 = SunPosition(jd0UT+  deltaT/24./3600.);
    var coor2 = SunPosition(jd0UT+1.+deltaT/24./3600.); // calculations for next day's UTC midnight

    var risetemp = new Object();
    var rise = new Object();
    // rise/set time in UTC.
    rise = RiseSet(jd0UT, coor1, coor2, lon, lat, 1);
    if (!recursive) { // check and adjust to have rise/set time on local calendar day
      if (zone>0) {
        // rise time was yesterday local time -> calculate rise time for next UTC day
        if (rise.rise>=24-zone || rise.transit>=24-zone || rise.set>=24-zone) {
          risetemp = SunRise(JD+1, deltaT, lon, lat, zone, 1);
          if (rise.rise>=24-zone) rise.rise = risetemp.rise;
          if (rise.transit >=24-zone) rise.transit = risetemp.transit;
          if (rise.set >=24-zone) rise.set  = risetemp.set;
        }
      }
      else if (zone<0) {
        // rise time was yesterday local time -> calculate rise time for next UTC day
        if (rise.rise<-zone || rise.transit<-zone || rise.set<-zone) {
          risetemp = SunRise(JD-1, deltaT, lon, lat, zone, 1);
          if (rise.rise<-zone) rise.rise = risetemp.rise;
          if (rise.transit<-zone) rise.transit = risetemp.transit;
          if (rise.set <-zone) rise.set  = risetemp.set;
        }
      }

      rise.transit = Mod(rise.transit+zone, 24.);
      rise.rise    = Mod(rise.rise   +zone, 24.);
      rise.set     = Mod(rise.set    +zone, 24.);

      // Twilight calculation
      // civil twilight time in UTC.
      risetemp = RiseSet(jd0UT, coor1, coor2, lon, lat, 1, -6.*DEG);
      rise.cicilTwilightMorning = Mod(risetemp.rise +zone, 24.);
      rise.cicilTwilightEvening = Mod(risetemp.set  +zone, 24.);

      // nautical twilight time in UTC.
      risetemp = RiseSet(jd0UT, coor1, coor2, lon, lat, 1, -12.*DEG);
      rise.nauticalTwilightMorning = Mod(risetemp.rise +zone, 24.);
      rise.nauticalTwilightEvening = Mod(risetemp.set  +zone, 24.);

      // astronomical twilight time in UTC.
      risetemp = RiseSet(jd0UT, coor1, coor2, lon, lat, 1, -18.*DEG);
      rise.astronomicalTwilightMorning = Mod(risetemp.rise +zone, 24.);
      rise.astronomicalTwilightEvening = Mod(risetemp.set  +zone, 24.);
    }
    return( rise );
  }



  // Find local time of moonrise and moonset
  // JD is the Julian Date of 0h local time (midnight)
  // Accurate to about 5 minutes or better
  // recursive: 1 - calculate rise/set in UTC
  // recursive: 0 - find rise/set on the current local day (set could also be first)
  // returns '' for moonrise/set does not occur on selected day
  function MoonRise(JD, deltaT, lon, lat, zone, recursive)
  {
    var timeinterval = 0.5;

    var jd0UT = Math.floor(JD-0.5)+0.5;   // JD at 0 hours UT
    var suncoor1 = SunPosition(jd0UT+ deltaT/24./3600.);
    var coor1 = MoonPosition(suncoor1, jd0UT+ deltaT/24./3600.);

    var suncoor2 = SunPosition(jd0UT +timeinterval + deltaT/24./3600.); // calculations for noon
    // calculations for next day's midnight
    var coor2 = MoonPosition(suncoor2, jd0UT +timeinterval + deltaT/24./3600.);

    var risetemp = new Object();
    var rise = new Object();

    // rise/set time in UTC, time zone corrected later.
    // Taking into account refraction, semi-diameter and parallax
    rise = RiseSet(jd0UT, coor1, coor2, lon, lat, timeinterval);

    if (!recursive) { // check and adjust to have rise/set time on local calendar day
      if (zone>0) {
        // recursive call to MoonRise returns events in UTC
        riseprev = MoonRise(JD-1., deltaT, lon, lat, zone, 1);

        // recursive call to MoonRise returns events in UTC
        //risenext = MoonRise(JD+1, deltaT, lon, lat, zone, 1);
        //alert("yesterday="+riseprev.transit+"  today="+rise.transit+" tomorrow="+risenext.transit);
        //alert("yesterday="+riseprev.rise+"  today="+rise.rise+" tomorrow="+risenext.rise);
        //alert("yesterday="+riseprev.set+"  today="+rise.set+" tomorrow="+risenext.set);

        if (rise.transit >= 24.-zone || rise.transit < -zone) { // transit time is tomorrow local time
          if (riseprev.transit < 24.-zone) rise.transit = ''; // there is no moontransit today
          else rise.transit  = riseprev.transit;
        }

        if (rise.rise >= 24.-zone || rise.rise < -zone) { // transit time is tomorrow local time
          if (riseprev.rise < 24.-zone) rise.rise = ''; // there is no moontransit today
          else rise.rise  = riseprev.rise;
        }

        if (rise.set >= 24.-zone || rise.set < -zone) { // transit time is tomorrow local time
          if (riseprev.set < 24.-zone) rise.set = ''; // there is no moontransit today
          else rise.set  = riseprev.set;
        }

      }
      else if (zone<0) {
        // rise/set time was tomorrow local time -> calculate rise time for former UTC day
        if (rise.rise<-zone || rise.set<-zone || rise.transit<-zone) {
          risetemp = MoonRise(JD+1., deltaT, lon, lat, zone, 1);

          if (rise.rise < -zone) {
            if (risetemp.rise > -zone) rise.rise = ''; // there is no moonrise today
            else rise.rise = risetemp.rise;
          }

          if (rise.transit < -zone)
          {
            if (risetemp.transit > -zone)  rise.transit = ''; // there is no moonset today
            else rise.transit  = risetemp.transit;
          }

          if (rise.set < -zone)
          {
            if (risetemp.set > -zone)  rise.set = ''; // there is no moonset today
            else rise.set  = risetemp.set;
          }

        }
      }

      if (rise.rise)    rise.rise = Mod(rise.rise+zone, 24.);    // correct for time zone, if time is valid
      if (rise.transit) rise.transit  = Mod(rise.transit +zone, 24.); // correct for time zone, if time is valid
      if (rise.set)     rise.set  = Mod(rise.set +zone, 24.);    // correct for time zone, if time is valid
    }
    return( rise );
  }

  // Meins
  var MoonCalc = new Object();

  MoonCalc.getMoonPosition = function (date, Lat, Lng) {

    /*
    if (eval(form.Year.value)<=1900 || eval(form.Year.value)>=2100 ) {
    alert("Dies Script erlaubt nur Berechnungen"+
    "in der Zeitperiode 1901-2099. Angezeigte Resultat sind ung�ltig.");
    return;
  }
  */
  var now = new Date();
  var diffTimeZone = -now.getTimezoneOffset()/60.;
  var DeltaT  = 65; // deltaT - difference among 'earth center' versus 'observered' time (TDT-UT), in seconds

  var JD0 = CalcJD( date.getDate(), date.getMonth()+1, date.getFullYear() );
  var JD  = JD0 + ( date.getHours() - diffTimeZone + date.getMinutes()/60. + date.getSeconds()/3600. ) / 24.;
  var TDT = JD+DeltaT/24./3600.;

  var lat      = Lat*DEG; // geodetic latitude of observer on WGS84
  var lon      = Lng*DEG; // latitude of observer
  var height   = 0 * 0.001; // altiude of observer in meters above WGS84 ellipsoid (and converted to kilometers)

  var gmst = GMST(JD);
  var lmst = GMST2LMST(gmst, lon);

  var observerCart = Observer2EquCart(lon, lat, height, gmst); // geocentric cartesian coordinates of observer

  var sunCoor  = SunPosition(TDT, lat, lmst*15.*DEG);   // Calculate data for the Sun at given time
  var moonCoor = MoonPosition(sunCoor, TDT, observerCart, lmst*15.*DEG);    // Calculate data for the Moon at given time
  var moonRise = MoonRise(JD0, DeltaT, lon, lat, diffTimeZone, 0);

  var Altitude  = (moonCoor.alt*RAD+Refraction(moonCoor.alt))*DEG;  // including refraction in Bogenmass (Radians)
  var Azimuth = (moonCoor.myaz); // in Bogenmass (Radians)
  var Distance = round10(moonCoor.distance).toFixed(0); // Entfernung Erdmittelpunkt zum Mond in km
  var Phase = moonCoor.moonPhase; // Name der Mondphase
  var Fraction = round1000(moonCoor.phase); // Beleuchtung des Mondes 0 - 1, http://de.wikipedia.org/wiki/Mondphase
  var Aufgang = HHMM(moonRise.rise);
  var Untergang = HHMM(moonRise.set);
  var Kulmination = HHMM(moonRise.transit); // Hoechsstand
  var AlterGrad = round1000(moonCoor.moonAge*RAD); // Mondalter in Grad, brauche aber Tage 29,5 Tage ist 360�
  var AlterDay = 29.5 / 360 * AlterGrad // Mondalter in Tagen


  return {
    altitude: Altitude,
    azimuth: Azimuth,
    distance: Distance,
    phase: Phase,
    fraction: Fraction,
    aufgang: Aufgang,
    untergang: Untergang,
    kulmination: Kulmination,
    alterday: AlterDay,
    altergrad: AlterGrad
  };

};


// export as AMD module / Node module / browser variable

if (typeof define === 'function' && define.amd) {
  define(MoonCalc);
} else if (typeof module !== 'undefined') {
  module.exports = MoonCalc;
} else {
  window.MoonCalc = MoonCalc;
}

}());
