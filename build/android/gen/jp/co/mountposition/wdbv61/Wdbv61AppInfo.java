package jp.co.mountposition.wdbv61;

import org.appcelerator.titanium.ITiAppInfo;
import org.appcelerator.titanium.TiApplication;
import org.appcelerator.titanium.TiProperties;
import org.appcelerator.titanium.util.Log;

/* GENERATED CODE
 * Warning - this class was generated from your application's tiapp.xml
 * Any changes you make here will be overwritten
 */
public final class Wdbv61AppInfo implements ITiAppInfo
{
	private static final String LCAT = "AppInfo";
	
	public Wdbv61AppInfo(TiApplication app) {
		TiProperties properties = app.getSystemProperties();
					
					properties.setString("ti.deploytype", "development");
	}
	
	public String getId() {
		return "jp.co.mountposition.wdbv61";
	}
	
	public String getName() {
		return "wdbv61";
	}
	
	public String getVersion() {
		return "1.0";
	}
	
	public String getPublisher() {
		return "gihyo.co.jp";
	}
	
	public String getUrl() {
		return "http://www.gihyo.co.jp";
	}
	
	public String getCopyright() {
		return "MOUNTPOSITION, INC";
	}
	
	public String getDescription() {
		return "wdbv61 sample app";
	}
	
	public String getIcon() {
		return "default_app_logo.png";
	}
	
	public boolean isAnalyticsEnabled() {
		return true;
	}
	
	public String getGUID() {
		return "9047d5aa-9205-4150-be37-47be9f5f3e2d";
	}
	
	public boolean isFullscreen() {
		return false;
	}
	
	public boolean isNavBarHidden() {
		return false;
	}
}
