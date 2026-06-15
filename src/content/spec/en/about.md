# About

Welcome to Aquamarine's personal blog! This site is built upon the powerful [Astro Fuwari](https://github.com/saicaca/fuwari) framework and features a series of deep customizations and enhancements based on its excellent original design. It aims to create a more comprehensive personal knowledge base and showcase platform tailored to personalized needs.

## ✨ Core Enhancements

### 1. 🌐 Powerful Internationalization (I18n) Support
In today's globalized world, cross-language communication and technical sharing are particularly important. I have completely refactored the I18n routing and rendering logic based on the original version:
- **Seamless Multilingual Switching**: Supports articles and documents in any language path. When switching between different language versions, it accurately navigates to the target translation.
- **Smart Fallback Mechanism**: When a translation is not yet available in the target language, the system gracefully degrades by displaying the main language content along with a thoughtful top banner, preventing visitors from encountering a 404 page.
- **Flexible Directory Structure**: Removes the restriction that articles must be stored in a specific hierarchy. You can now freely manage your Markdown content in the root directory or any language-specific folder.

### 2. 📚 Brand New Docs System
In addition to the standard timeline-driven Blog, this site introduces an independent **Docs system**:
- **Tree-based Multi-level Navigation**: Automatically generates a tree directory in the sidebar based on folder structure, ideal for writing tutorials, systematic technical notes, or serialized content.
- **Knowledge Base Accumulation**: Perfectly separates fragmented daily blogs from systematic hardcore knowledge, providing a more focused and immersive reading experience for long technical documents.
- **Comprehensive Multilingual Adaptation**: The Docs system also fully inherits the global I18n routing and Fallback mechanisms.

### 3. 🎵 Global Background Music (BGM) Player
To provide an atmospheric and immersive reading experience, I added a global background music player to the website:
- **Seamless Playback**: Thanks to the Swup-based SPA smooth routing mechanism, the background music continues to play uninterrupted regardless of how you navigate between articles, categories, or tags.
- **Personalized Customization**: In the future, it will support more custom playlists, letting music accompany every visitor's reading time.

### 4. 📱 Mobile TOC Adaptation
For long articles and documents, a sidebar Table of Contents (TOC) is essential for a good reading experience. Addressing potential inconveniences of the original version on mobile devices, this site includes responsive optimizations:
- **Floating Mobile Directory**: On small-screen devices like phones or tablets, the article outline automatically collapses into an elegant floating button.
- **One-tap Access**: While reading long texts, visitors can bring up the directory at any time to quickly jump to sections of interest, eliminating the need to scroll back and forth and greatly improving mobile lookup efficiency.

### 5. 🗂️ Independent Archive Systems for Blog and Docs
To make content discovery clearer and more intuitive, the Archive page has been refactored and expanded:
- **Separate Timelines**: Established independent archive pages for Blog posts and Docs tutorials, ensuring they don't interfere with each other.
- **Clear Content Organization**: Whether you're reviewing past essays or looking for specific tutorial series, you can easily find them in their respective archive timelines.

### 6. 🤝 Friend Links System
Meeting on the internet is a beautiful fate. A new elegant Friend Links (Friends) page has been added:
- **Custom Friend Cards**: Displays friends' avatars, nicknames, bios, and links using unified and beautiful UI cards.
- **Easy Expansion**: Supports categorized friend links, making the site more interconnected and encouraging communication among fellow bloggers.

## 🚀 Open Source & Project URL

Sharing brings more joy. All customized code and new features of this blog are open-sourced on GitHub. If you like these extensions or want to build your own powerful multilingual personal site based on this, welcome to visit and Star my repository:

::github{repo="aquamarine-z/aqua-blog-fuwari"}

---

> ### 🙏 Acknowledgements & Copyright
> 
> The basic UI framework and core inspiration of this site come from:
> - [Astro Fuwari](https://github.com/saicaca/fuwari) by saicaca
>
> Background images/illustrations used in site demos and default configurations:
> - [Unsplash](https://unsplash.com/)
> - [星と少女](https://www.pixiv.net/artworks/108916539) by [Stella](https://www.pixiv.net/users/93273965)
> - [Rabbit - v1.4 Showcase](https://civitai.com/posts/586908) by [Rabbit_YourMajesty](https://civitai.com/user/Rabbit_YourMajesty)
