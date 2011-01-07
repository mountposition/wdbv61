#
# Titanium mobile Rakefile for iPhone build
#

DEV_PROVISIONING_UUID = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
DEV_SIGN = "Developer name"
DEV_APP_NAME = "DevApp"
DEV_APP_ID = 'com.example.dev'

TITANIUM_SDK_VERSION = '1.4.2'
IPHONE_SDK_VERSION = '4.2'
BUILDER = "/Library/Application Support/Titanium/mobilesdk/osx/#{TITANIUM_SDK_VERSION}/iphone/builder.py"

task :run do
  sh BUILDER, 'run', './'
end

task :install do
  sh BUILDER, 'install', IPHONE_SDK_VERSION, './', DEV_APP_ID, DEV_APP_NAME, DEV_PROVISIONING_UUID, DEV_SIGN
end

task :adhoc => [:install] do
  version = "#{DEV_APP_NAME}-#{Time.now.strftime("%Y%m%d-%H%M%S")}"
  FileUtils.mkdir_p "build/adhoc/#{version}"
  File.open("build/adhoc/#{version}/version.txt",'w') do |f|
    f.puts(version)
  end
  FileUtils.cp_r "build/iphone/build/Release-iphoneos/#{DEV_APP_NAME}.app", "build/adhoc/#{version}/"
  FileUtils.cp File.expand_path("~/Library/MobileDevice/Provisioning Profiles/#{DEV_PROVISIONING_UUID}.mobileprovision"), "build/adhoc/#{version}/#{DEV_APP_NAME}-dev.mobileprovision"
  sh 'ditto', '-ck', '--keepParent', '--sequesterRsrc', "build/adhoc/#{version}", "build/adhoc/#{version}.zip"
  FileUtils.rm_rf "build/adhoc/#{version}"
  puts "[INFO] Zipped AdHoc: build/adhoc/#{version}.zip"
end

task :log do
  sh 'cat build/iphone/build/build.log'
end