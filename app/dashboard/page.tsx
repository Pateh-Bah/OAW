'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);

      if (!user) {
        window.location.href = '/auth/login';
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome</CardTitle>
              <CardDescription>
                {user?.email ? `Logged in as: ${user.email}` : 'Welcome to your dashboard'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                This is your Overhead Aluminium Workshop dashboard. From here you can manage
                employees, customers, projects, and more.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Employees</CardTitle>
              <CardDescription>Manage your workforce</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Manage Employees</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customers</CardTitle>
              <CardDescription>Track customer information</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Manage Customers</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Monitor ongoing projects</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">View Projects</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budget</CardTitle>
              <CardDescription>Financial overview</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">View Budget</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">View Reports</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}