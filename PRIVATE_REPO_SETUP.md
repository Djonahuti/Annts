# Private Repo Deployment Guide for Annhurst-ts (VPS + GitHub Actions)

This guide explains how to safely convert your **public GitHub
repository** into a **private one** while keeping your deployment
working smoothly both on:

-   GitHub Actions (SSH deployment to VPS)
-   Your VPS where the repo is already cloned under `/apps/Annhurst-ts`

You are using **SSH deployment**, so this setup is perfect for private
repos.

------------------------------------------------------------------------

## ✅ Overview

Once the repository becomes private:

-   **GitHub Actions continues to work normally** (no changes needed).
-   **Your VPS clone will no longer be able to pull** unless you
    configure a **Deploy Key**.

This README shows exactly how to fix that using **Option 1: Deploy Key
(recommended)**.

------------------------------------------------------------------------

# 🚀 OPTION 1 --- Use a Deploy Key (Recommended)

A deploy key gives your VPS **read-only SSH access** to your private
repo.

------------------------------------------------------------------------

# STEP 1 --- Generate Deploy Key on VPS

SSH into your VPS:

``` bash
ssh youruser@yourserverip
```

Generate a new SSH key pair specifically for this repo:

``` bash
ssh-keygen -t ed25519 -C "annhurst-ts-deploy-key"
```

Save it to:

    /home/youruser/.ssh/annhurst-ts-deploy

No passphrase needed --- press enter.

------------------------------------------------------------------------

# STEP 2 --- Copy the Public Key

``` bash
cat ~/.ssh/annhurst-ts-deploy.pub
```

Copy the entire SSH key.\
It will look like:

    ssh-ed25519 AAAAC3NzaC1... annhurst-ts-deploy-key

------------------------------------------------------------------------

# STEP 3 --- Add the Deploy Key in GitHub

Go to:

**GitHub → Your Repo (Annhurst-ts) → Settings → Deploy Keys → Add deploy
key**

-   **Title:** VPS Deploy Key\
-   **Key:** paste the public key\
-   **Allow write access:** ❌ *leave unchecked* (READ ONLY)

Click **Add Key**.

------------------------------------------------------------------------

# STEP 4 --- Configure SSH on VPS to Use This Key

Edit SSH config:

``` bash
nano ~/.ssh/config
```

Add:

    Host github-annhurst
        HostName github.com
        User git
        IdentityFile ~/.ssh/annhurst-ts-deploy
        IdentitiesOnly yes

Fix permissions:

``` bash
chmod 600 ~/.ssh/annhurst-ts-deploy
chmod 600 ~/.ssh/config
```

------------------------------------------------------------------------

# STEP 5 --- Update the Git Remote in Your VPS Clone

Go to your project directory:

``` bash
cd /apps/Annhurst-ts
```

Set the new remote:

``` bash
git remote set-url origin git@github-annhurst:Djonahuti/Annhurst-ts.git
```

Confirm:

``` bash
git remote -v
```

Output should show:

    origin  git@github-annhurst:Djonahuti/Annhurst-ts.git (fetch)
    origin  git@github-annhurst:Djonahuti/Annhurst-ts.git (push)

------------------------------------------------------------------------

# STEP 6 --- Test It

``` bash
git pull
```

If everything is correct, it should pull without asking for username or
password.

------------------------------------------------------------------------

# 🎉 You're Done!

Your deployment environment is now fully secure:

-   GitHub Actions can deploy via SSH normally.
-   Your VPS can pull from the private repo using a secure **read-only
    deploy key**.
-   You avoid using tokens or exposing credentials.

------------------------------------------------------------------------

# Optional --- Deployment Optimization

If needed, I can also help you add:

-   🔄 Zero-downtime deployment (`pm2 reload`)
-   🔐 More secure SSH setup
-   📦 Auto backup + rollback
-   🚀 Faster GitHub Actions workflow

Just ask: **Optimize my deployment setup**.
