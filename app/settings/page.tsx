import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { User, CreditCard, Bell, Globe, Shield, Key, ChevronRight, Lock, Zap } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="account">
        <div className="flex">
          <div className="w-48 mr-6">
            <TabsList className="flex flex-col h-auto bg-transparent p-0 justify-start">
              <TabsTrigger value="account" className="justify-start w-full mb-1 data-[state=active]:bg-muted">
                <User className="h-4 w-4 mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger value="billing" className="justify-start w-full mb-1 data-[state=active]:bg-muted">
                <CreditCard className="h-4 w-4 mr-2" />
                Billing
              </TabsTrigger>
              <TabsTrigger value="notifications" className="justify-start w-full mb-1 data-[state=active]:bg-muted">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="api" className="justify-start w-full mb-1 data-[state=active]:bg-muted">
                <Key className="h-4 w-4 mr-2" />
                API
              </TabsTrigger>
              <TabsTrigger value="security" className="justify-start w-full mb-1 data-[state=active]:bg-muted">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1">
            <TabsContent value="account" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account information and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Profile</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" defaultValue="Petri Labs" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" defaultValue="hello@petrilabs.com" />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="theme" className="block">
                            Theme
                          </Label>
                          <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Light</span>
                          <Switch id="theme" />
                          <span className="text-sm">Dark</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="language" className="block">
                            Language
                          </Label>
                          <p className="text-sm text-muted-foreground">Set your preferred language</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">English (US)</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Billing</CardTitle>
                  <CardDescription>Manage your subscription and payment methods</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Current Plan</h3>
                    <div className="rounded-lg border p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Free Plan</h4>
                          <p className="text-sm text-muted-foreground">Basic features with limited usage</p>
                        </div>
                        <Badge>Current</Badge>
                      </div>
                      <Separator className="my-4" />
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-green-500" />
                          <span className="text-sm">10 searches per day</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Perplexity integration</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Basic optimization tools</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button variant="outline" className="w-full">
                          Upgrade Plan
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Payment Methods</h3>
                    <div className="rounded-lg border p-4 flex justify-between items-center">
                      <div className="text-center text-muted-foreground">
                        <p>No payment methods added yet</p>
                      </div>
                    </div>
                    <Button variant="outline">Add Payment Method</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Manage your notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Optimization Results</p>
                          <p className="text-sm text-muted-foreground">Receive emails when optimization is complete</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Weekly Reports</p>
                          <p className="text-sm text-muted-foreground">
                            Receive weekly summary of your SEO performance
                          </p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Product Updates</p>
                          <p className="text-sm text-muted-foreground">
                            Receive updates about new features and improvements
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>Save Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>API Settings</CardTitle>
                  <CardDescription>Manage your API keys and integrations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">API Keys</h3>
                    <div className="rounded-lg border p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Petri API Key</h4>
                          <p className="text-sm text-muted-foreground">Use this key to access the Petri API</p>
                        </div>
                        <Badge variant="outline">Free Plan</Badge>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Input value="••••••••••••••••••••••••••••••" readOnly className="font-mono" />
                        <Button variant="outline">Copy</Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Last used: Never</p>
                    </div>
                    <Button variant="outline">Regenerate API Key</Button>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Integrations</h3>
                    <div className="rounded-lg border p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-lg">🔍</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Perplexity</h4>
                            <p className="text-sm text-muted-foreground">Connected</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-lg">🤖</span>
                          </div>
                          <div>
                            <h4 className="font-medium">ChatGPT</h4>
                            <p className="text-sm text-muted-foreground">Not connected</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" disabled>
                          Connect
                          <Badge variant="outline" className="ml-2 text-[10px]">
                            Soon
                          </Badge>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Manage your account security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div></div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </div>
                    <Button>Change Password</Button>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Enable 2FA</p>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Sessions</h3>
                    <div className="rounded-lg border p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Current Session</h4>
                          <p className="text-sm text-muted-foreground">Chrome on Windows • 192.168.1.1</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                    </div>
                    <Button variant="outline" className="gap-2">
                      <Lock className="h-4 w-4" />
                      Log Out All Devices
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  )
}

