---
title: "Privacy Policy — GeoCam (Geospatial Photo Documentation)"
description: "Privacy Policy for GeoCam, an Android geospatial photo documentation application. Explains how camera, precise location, local storage, and Google Maps services are used."
date: "2026-11-13"
banner:
  src: "../../images/articles/geocam-privacy-policy/thumbnail.jpg"
  alt: "GeoCam Privacy Policy Thumbnail"
categories:
  - "Privacy Policy"
  - "Android"
keywords:
  - "GeoCam"
  - "Privacy Policy"
  - "Android"
  - "Geospatial"
  - "Google Maps"
---

**Effective Date:** November 13, 2026  
**Application:** GeoCam (Geospatial Photo Documentation App)  
**Developer:** Fawcet Jenusdy Makay  
**Contact:** [jenusdy@gmail.com](mailto:jenusdy@gmail.com)  

---

## 1. Introduction

This Privacy Policy explains how **GeoCam** ("the App", "we", "our") handles your information when you use our Android application for field documentation, supervision, and ground-check photography.

GeoCam is designed with a **local-first, on-device** architecture. We do not operate a backend server to collect, store, or sell your personal data, photos, or location history.

---

## 2. Information & Permissions We Use

To provide its core geospatial documentation features, GeoCam requests only the permissions strictly necessary for the app to function:

### 2.1. Precise Location Data (`ACCESS_FINE_LOCATION` / `ACCESS_COARSE_LOCATION`)
* **Purpose:** GeoCam accesses your device's GPS and network location (via `FusedLocationProviderClient` with high-accuracy priority) to:
  * Display your real-time position and compass direction on the interactive **Google Maps Hybrid** view.
  * Stamp accurate **Latitude, Longitude, and Elevation** (meters above sea level) onto your captured photos and into their EXIF metadata.
  * Perform **Reverse Geocoding** (via Android `Geocoder`) to resolve your coordinates into a human-readable address (Street, Village/Sub-district, District, City/Regency, Province). When offline, the address falls back to an offline indicator without blocking photo capture.
* **Foreground Only:** Location is accessed only while you are actively using the App. GeoCam does **not** track your location in the background.

### 2.2. Camera (`CAMERA`)
* **Purpose:** GeoCam uses the Android CameraX API solely to display the live camera viewfinder and capture high-resolution photographs when you tap the shutter button.
* **Processing:** All image processing—including rendering the 7-element watermark overlay (Title, Description, Logo, Hybrid Minimap snapshot, Coordinates & Elevation, Address, and Timestamp)—is performed locally on your device.

### 2.3. Photos, Media & Local Storage (`MediaStore` API & Android Photo Picker)
* **Saving Captured Photos:** Finalized JPEG images (`GeoCam_YYYYMMDD_HHmmss.jpg`) are saved directly to your device's public gallery directory (`Pictures/GeoCam/` or `DCIM/GeoCam/`) via the Android `MediaStore` API so they remain accessible in both GeoCam's internal gallery and your system gallery.
* **Custom Watermark Logo:** When you choose a custom logo in Settings, GeoCam uses the **Android Photo Picker** (`PickVisualMedia`), which grants access only to the specific image you select without requesting broad access to your entire photo library.
* **Local App Storage:** Your watermark template preferences (Title, Description, and custom Logo URI) are stored locally using **Jetpack DataStore Preferences**, and photo metadata is indexed locally in an on-device **Room Database** for fast gallery display and map markers.

---

## 3. Third-Party Services

GeoCam relies on the following Google platform services to render maps and resolve addresses:

1. **Google Maps SDK for Android & Maps Compose:** Used to display the `MAP_TYPE_HYBRID` (satellite imagery with street and place labels) map and generate the minimap snapshot embedded in photo watermarks.
2. **Google Play Services Location & Android Geocoder:** Used to acquire high-accuracy GPS coordinates/elevation and translate coordinates into street addresses when an internet connection is available.

When using these map and geocoding features, certain technical data (such as IP address, device identifiers, and map tile/coordinate requests) may be processed by Google in accordance with the [Google Privacy Policy](https://policies.google.com/privacy) and [Google Maps Platform Terms of Service](https://cloud.google.com/maps-platform/terms/).

GeoCam does **not** integrate any third-party advertising networks, behavioral analytics SDKs, or user-tracking tools.

---

## 4. Data Storage, Retention, and Sharing

* **No Cloud Upload by GeoCam:** We do not upload your photos, location coordinates, or template settings to any developer-controlled server.
* **User-Initiated Sharing:** Your photos remain private on your device unless you explicitly choose to share them using the Android system Share action from the Gallery view.
* **Data Deletion:** You have full control over your data. You can delete individual photos directly from GeoCam's Gallery or your device's file manager/gallery app, and you can clear all local preferences and database records at any time by clearing the App's storage or uninstalling GeoCam.

---

## 5. Children's Privacy

GeoCam is a professional and general-utility geospatial documentation tool and is not directed to children under the age of 13. We do not knowingly collect personal information from children.

---

## 6. Changes to This Privacy Policy

We may update this Privacy Policy from time to time to reflect app updates, new features, or legal/platform requirements. Any changes will be posted on this page with an updated **Effective Date**.

---

## 7. Contact Us

If you have any questions, concerns, or requests regarding this Privacy Policy or how GeoCam handles your data, please contact:

* **Developer:** Fawcet Jenusdy Makay
* **Email:** [jenusdy.dev@gmail.com](mailto:jenusdy.dev@gmail.com)
* **Website:** [https://jenusdy.github.io/](https://jenusdy.github.io/)

