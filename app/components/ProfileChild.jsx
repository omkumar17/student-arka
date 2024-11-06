import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const ProfileChild = () => {
    const { data: session } = useSession();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const enrollment = session?.user?.enrollment;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_IP}/profiledetails`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ enrollment }),
                });

                if (response.status === 404) {
                    throw new Error("Profile data not found for this enrollment.");
                }

                const data = await response.json();
                console.log(data.user[0]);
                setProfile(data.user[0]);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (enrollment) {
            fetchProfile();
        }
    }, [enrollment]);

    return (
        <div className="p-4 my-10 h-[90vh] container mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-center">Profile Details</h1>

            {loading ? (
                <p>Loading profile details...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : profile ? (
                <div className="flex flex-col font-bold text-lg justify-center border-4 dark:border-2 p-6 rounded shadow space-y-2">
                    <span className="capitalize text-4xl py-2 font-bold text-white px-2 rounded-xl bg-green-700">{profile.firstName} {profile.lastName}</span>

                    <p>
                        <strong className="text-blue-600 mr-4">Enrollment:</strong>
                        <span>{profile.enrollment || 'Not set'}</span>
                    </p>

                    <p>
                        <strong className="text-blue-600 mr-4">Email:</strong>
                        <span>{profile.email || 'Not set'}</span>
                    </p>

                    <p>
                        <strong className="text-blue-600 mr-4">Contact:</strong>
                        <span>{profile.phone || 'Not set'}</span>
                    </p>

                    <p>
                        <strong className="text-blue-600 mr-4">Branch:</strong>
                        <span className="uppercase">{profile.branch || 'Not set'}</span>
                    </p>

                    <p>
                        <strong className="text-blue-600 mr-4">Session:</strong>
                        <span>{profile.session || 'Not set'}</span>
                    </p>

                    <p>
                        <strong className="text-blue-600 mr-4">Location:</strong>
                        <span className="capitalize">{profile.location || 'Not set'}</span>
                    </p>

                    <p>
                        <strong className="text-blue-600 mr-4">Status:</strong>
                        <span className="capitalize">{profile.status || 'N/A'}</span>
                    </p>

                    <p>
                        <strong className="text-blue-600 mr-4">Reason:</strong>
                        <span className="capitalize">{profile.reason || 'Not set'}</span>
                    </p>
                </div>
            ) : (
                <p className="text-gray-500">No profile details found.</p>
            )}

            <p className="text-center text-red-600 text-lg mt-4">
                NOTE: For update/correction you details please contact with student support.
                Add: Block - A,  Room no : 420.
                Email: bussupport@gmail.com

            </p>
        </div>
    );
};

export default ProfileChild;
