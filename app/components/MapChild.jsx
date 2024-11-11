"use client";

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Dynamically import MapContainer and other components for client-side rendering
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

export const MapChild = (id) => {
    const [busIcon, setBusIcon] = useState(null);
    const [busId, setBusId] = useState(id.id);
    const searchParams = useSearchParams();
    // console.log(searchParams);
    
    console.log("id",id);
    
    const [latitude,setLatitude]=useState();
    const [longitude,setLongitude]=useState();
    const [loading,setLoading]=useState(false);
    // const busId = searchParams.get('busId');
    const fetchLocation = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_IP}/getLocation?busId=${busId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch location data');
            }

            const data = await response.json();
            setLatitude(data.latitude);
            setLongitude(data.longitude);
            console.log("data",data)
            
        } catch (err) {
           console.log(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (busId) {
            fetchLocation();
        }
    }, [busId]);

    useEffect(() => {
        // Import `L` dynamically to ensure this runs only in the browser
        import('leaflet').then(L => {
            const customBusIcon = L.icon({
                iconUrl: '/img/location.png', // Replace with the path to your custom icon
                iconSize: [32, 32], // Adjust size as needed
                iconAnchor: [16, 32], // Point of the icon which corresponds to the marker's location
                popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
            });
            setBusIcon(customBusIcon);
        });
    }, []);

    return (
        <div className='mt-10 z-1'>
            
            <h1>Bus Location {busId ? `for GPS ID: ${busId}` : ''}</h1>
            {latitude && longitude ? (
                <MapContainer center={[22.8046, 86.2029]} zoom={15} style={{ height: '500px', width: '100%' }} className='z-0'>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {busIcon && (
                        <Marker position={[latitude, longitude]} icon={busIcon}>
                            <Popup>Bus Location</Popup>
                        </Marker>
                    )}
                </MapContainer>
            ) : (
                <p>Please provide latitude and longitude.</p>
            )}
        </div>
    );
};

export default MapChild;
