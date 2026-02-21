# DNS Setup Guide for quanluxury.africa

This guide explains how to point the **quanluxury.africa** domain to GitHub Pages so the site loads correctly in every browser, including Safari.

> **You only need to do this once.** After it is done, the domain will keep working automatically.

---

## What you will be adding

| Record type | Host / Name | Value / Points to |
|-------------|-------------|-------------------|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `jahooskii.github.io` |

`@` means the **root** of your domain (i.e. `quanluxury.africa` without any prefix).

---

## Step-by-step instructions

### 1 — Log in to your domain registrar

Go to the website where you **bought** the domain (examples: Namecheap, GoDaddy, Cloudflare, Google Domains, Hostinger, Afrihost, etc.) and sign in to your account.

### 2 — Find the DNS / Name Server settings

Look for a menu item called one of:
- **DNS Management**
- **Advanced DNS**
- **Manage DNS**
- **DNS Records**
- **Name Servers / Zone Editor**

It is usually inside **Domains → quanluxury.africa → Manage** or similar.

### 3 — Delete any existing A records for `@`

If you already have any `A` records pointing `@` somewhere else, **delete them first** so there is no conflict.

### 4 — Add the four A records

Click **Add Record** (or **Add New Record**) and fill in the fields exactly as shown below. Repeat this four times, once for each IP address:

| Field | Value |
|-------|-------|
| **Type** | `A` |
| **Host / Name** | `@` |
| **Value / Points to / IP Address** | `185.199.108.153` |
| **TTL** | `Automatic` or `3600` |

Then add the same record three more times with these IP addresses:
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

### 5 — Add the CNAME record for `www`

Click **Add Record** again and fill in:

| Field | Value |
|-------|-------|
| **Type** | `CNAME` |
| **Host / Name** | `www` |
| **Value / Points to** | `jahooskii.github.io` |
| **TTL** | `Automatic` or `3600` |

### 6 — Save

Click **Save** (or **Confirm Changes**). Most registrars apply changes within a few minutes, but DNS can take up to **48 hours** to fully propagate worldwide.

---

## How to check it is working

Open a terminal (Mac: Spotlight → Terminal, Windows: Command Prompt) and run:

```
nslookup quanluxury.africa
```

When it shows one of the four IP addresses above (`185.199.108.x`), DNS is working.

You can also visit **https://quanluxury.africa** in Safari — it should load the Quan Lux app.

---

## Registrar-specific quick links

| Registrar | Where to find DNS settings |
|-----------|---------------------------|
| **Namecheap** | Dashboard → Domain List → Manage → Advanced DNS |
| **GoDaddy** | My Products → DNS → Manage Zones |
| **Cloudflare** | Select domain → DNS → Records |
| **Google Domains / Squarespace** | DNS → Manage custom records |
| **Hostinger** | Domains → Manage → DNS / Nameservers |
| **Afrihost** | My Products → Domain → DNS Management |

---

## Already done in this repository

The `CNAME` file at the root of this repository already contains `quanluxury.africa`.  
That tells GitHub Pages which custom domain to use.  
Once you complete the DNS steps above, the connection between the domain and GitHub Pages will be complete.
