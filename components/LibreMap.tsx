"use client"

import React, {useState, useEffect} from "react";

import Map from "react-map-gl";
import maplibregl from "maplibre-gl";
import DeckGL from "@deck.gl/react/typed";
import {GeoJsonLayer} from "@deck.gl/layers/typed";

// import map config
import {
    MAP_STYLE,
    LIGHTNING_EFFECT,
    MATERIAL,
    INITIAL_VIEW_STATE,
    COLOR_RANGE,
} from "@/lib/mapconfig";

const DeckGlMap = () => {


    return (
        <DeckGL
            /*layers={geoJsonData ? layers : []}*/
            initialViewState={INITIAL_VIEW_STATE}
            controller={true}
            /*getTooltip={getTooltip}*/
            effects={[LIGHTNING_EFFECT]}
        >
            <Map reuseMaps
                 mapLib={maplibregl}
                 mapStyle={MAP_STYLE}
                 />
        </DeckGL>
    );
}

export default DeckGlMap
