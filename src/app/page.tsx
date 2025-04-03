"use client";

import { useEffect, useState } from "react";

interface Event {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  status: string;
  folder: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Producer {
  id: number;
  name: string;
  domain: string;
  contactEmail: string;
  firebaseWebAppId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  events: Event[];
}

interface ResponseDto {
  success: boolean;
  data?: Producer;
  error?: string;
}

export default function Home() {
  const [producer, setProducer] = useState<Producer | null>(null);
  const [loading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProducer() {
      try {
        const response = await fetch("/api/producer");
        const res: ResponseDto = await response.json();
        if (res.success && res.data) {
          setProducer(res.data);
        }
      } catch (err) {
        console.error("Error fetching producer:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducer();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-medium">Loading...</p>
      </div>
    );
  }

  if (!producer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-medium text-red-500">No producer data found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50 text-black">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{producer.name}</h1>
        <div className="mb-6">
          <p>
            <span className="font-semibold">Domain:</span> {producer.domain}
          </p>
          <p>
            <span className="font-semibold">Contact Email:</span> {producer.contactEmail}
          </p>
          <p>
            <span className="font-semibold">Firebase Web App ID:</span> {producer.firebaseWebAppId}
          </p>
          <p>
            <span className="font-semibold">Status:</span> {producer.status}
          </p>
          <p>
            <span className="font-semibold">Created At:</span>{" "}
            {new Date(producer.createdAt).toLocaleString()}
          </p>
          <p>
            <span className="font-semibold">Updated At:</span>{" "}
            {new Date(producer.updatedAt).toLocaleString()}
          </p>
        </div>

        <h2 className="text-2xl font-semibold mb-3">Events</h2>
        {producer.events && producer.events.length > 0 ? (
          <div className="space-y-4">
            {producer.events.map((event) => (
              <div
                key={event.id}
                className="border border-gray-200 p-4 rounded-md shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-xl font-bold">{event.name}</h3>
                <p className="text-gray-700">{event.description}</p>
                <div className="mt-2 text-sm text-gray-600">
                  <p>
                    <span className="font-semibold">Start Date:</span>{" "}
                    {new Date(event.startDate).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-semibold">End Date:</span>{" "}
                    {new Date(event.endDate).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-semibold">Location:</span> {event.location}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span> {event.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No events available.</p>
        )}
      </div>
    </div>
  );
}
