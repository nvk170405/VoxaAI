import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  Settings, 
  Crown, 
  Shield, 
  Cloud, 
  Mic, 
  Zap,
  Globe,
  Download,
  Share,
  Bell,
  Lock
} from "lucide-react";

interface SettingsViewProps {
  userPlan: "basic" | "premium";
  onPlanChange: (plan: "basic" | "premium") => void;
}

export const SettingsView = ({ userPlan, onPlanChange }: SettingsViewProps) => {
  const [settings, setSettings] = useState({
    notifications: true,
    autoTranscription: true,
    darkMode: false,
    offlineMode: userPlan === "premium",
    encryptionLevel: userPlan === "premium" ? "advanced" : "basic",
    autoBackup: true,
    shareAnalytics: userPlan === "premium",
    language: "English",
    micQuality: 85,
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const storageUsed = userPlan === "premium" ? 2.4 : 0.8;
  const storageLimit = userPlan === "premium" ? 10 : 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {/* Subscription Management */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Current Plan</h3>
              <p className="text-sm text-muted-foreground">
                {userPlan === "premium" ? "$25/month - All features included" : "$10/month - Basic features"}
              </p>
            </div>
            <Badge 
              className={userPlan === "premium" ? "tier-premium" : "tier-basic"}
            >
              {userPlan === "premium" && <Crown className="h-3 w-3 mr-1" />}
              {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}
            </Badge>
          </div>
          
          {userPlan === "basic" && (
            <Button onClick={() => onPlanChange("premium")}>
              <Zap className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>
          )}
          
          {userPlan === "premium" && (
            <Button variant="outline" onClick={() => onPlanChange("basic")}>
              Downgrade to Basic
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Audio & Transcription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Audio & Transcription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Auto-transcription</h3>
              <p className="text-sm text-muted-foreground">
                Automatically convert voice recordings to text
              </p>
            </div>
            <Switch 
              checked={settings.autoTranscription}
              onCheckedChange={(checked) => updateSetting("autoTranscription", checked)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Microphone Quality</h3>
              <span className="text-sm text-muted-foreground">{settings.micQuality}%</span>
            </div>
            <Slider
              value={[settings.micQuality]}
              onValueChange={(value) => updateSetting("micQuality", value[0])}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Multi-language Support</h3>
              <p className="text-sm text-muted-foreground">
                {userPlan === "premium" ? "Available" : "Premium feature"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              {userPlan !== "premium" && <Crown className="h-3 w-3 text-muted-foreground" />}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Encryption Level</h3>
              <p className="text-sm text-muted-foreground">
                {settings.encryptionLevel === "advanced" ? "Advanced encryption (Premium)" : "Basic encryption"}
              </p>
            </div>
            <Badge variant={settings.encryptionLevel === "advanced" ? "default" : "secondary"}>
              {settings.encryptionLevel === "advanced" && <Crown className="h-3 w-3 mr-1" />}
              {settings.encryptionLevel}
            </Badge>
          </div>

          {userPlan === "premium" && (
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Incognito Mode</h3>
                <p className="text-sm text-muted-foreground">
                  Extra private journaling with enhanced security
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                <Crown className="h-3 w-3 text-primary" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cloud & Storage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Cloud & Storage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Storage Used</span>
              <span>{storageUsed}GB / {storageLimit}GB</span>
            </div>
            <div className="progress-track">
              <div 
                className="progress-fill"
                style={{ width: `${(storageUsed / storageLimit) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Auto Backup</h3>
              <p className="text-sm text-muted-foreground">
                Automatically backup your journals to the cloud
              </p>
            </div>
            <Switch 
              checked={settings.autoBackup}
              onCheckedChange={(checked) => updateSetting("autoBackup", checked)}
            />
          </div>

          {userPlan === "premium" && (
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Offline Mode</h3>
                <p className="text-sm text-muted-foreground">
                  Journal offline and sync when connected
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  checked={settings.offlineMode}
                  onCheckedChange={(checked) => updateSetting("offlineMode", checked)}
                />
                <Crown className="h-3 w-3 text-primary" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Integrations (Premium) */}
      {userPlan === "premium" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share className="h-5 w-5" />
              Integrations
              <Crown className="h-4 w-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Cloud className="h-5 w-5" />
                <span className="text-sm">Google Drive</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Download className="h-5 w-5" />
                <span className="text-sm">Notion</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Bell className="h-5 w-5" />
                <span className="text-sm">Calendar</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Push Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Daily reminders to journal
              </p>
            </div>
            <Switch 
              checked={settings.notifications}
              onCheckedChange={(checked) => updateSetting("notifications", checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};