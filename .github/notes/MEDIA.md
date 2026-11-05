# Preview media and captions

The catalog keeps the original download URL in each file entry's `url` field. Preview players support an optional **direct MP4** `previewUrl` and an optional `previewSize` describing that preview's actual size. Downloads always use `url`; selecting a different preview never changes the downloaded file.

Without a valid `previewUrl`, the player streams the original file and says so in the data-use notice. A separate preview URL does not itself guarantee a smaller or faster video: encode and measure the preview before publishing it. The current catalog does not contain separately encoded preview assets, and this change does not claim to have reduced the existing videos' bitrate or download size.

A file entry can also declare local WebVTT captions:

```js
{
  url: 'https://github.com/Qstrx/noctis/releases/download/scenepacks-v2/Price-MW1-4K.mp4',
  size: '1.94 GB',
  // Example optional assets: create and verify these files before adding the fields.
  previewUrl: 'assets/media/previews/price-mw1.mp4',
  previewSize: '42 MB',
  captions: [
    {
      src: 'assets/media/captions/price-mw1.en.vtt',
      srclang: 'en',
      label: 'English',
      default: true
    }
  ]
}
```

The example preview paths and size are illustrative; those assets are not included in the repository. Put the optional fields on the individual file object, including each multipart file and each edition that needs them. For SIX, the unsplit episode object is also its file object. For campaign cutscenes, attach the fields to the edition's scene file object used by the player; the detail player uses the 1080p edition for its preview.

Preview URLs must be HTTP(S) on this site's own origin, or HTTPS on one of the permitted media hosts (`github.com`, `release-assets.githubusercontent.com`). Use a directly playable MP4, not a provider's HTML file-viewer page. Invalid optional URLs fall back to the original download. Same-origin relative paths resolve from the HTML page, so `assets/media/...` works under the `/noctis/` GitHub Pages project path. GitHub release URLs should use the stable `/releases/download/...` address, not an expiring CDN redirect.

Caption `src` must resolve to this site's own origin. `srclang` is a language tag, such as `en` or `en-GB`; `label` names the track in the native video controls. `default: true` requests that track initially. Multiple tracks are supported. Files are appended as native `<track kind="captions">` elements; the video's controls provide their language selection. Publish `.vtt` files as `text/vtt` and check that the browser loads them without CSP or network errors.

No caption files were present in the audited source or supplied with the requested fixes. The sampled MP4 metadata contained video and audio, without subtitle tracks. The player now supports captions, but captions for spoken content still need to be authored or recovered, checked for timing and accuracy, and published. Do not add empty tracks or label unverified transcripts as complete captions.

When preparing separate previews, preserve the scene timeline and duration if timestamp sharing is required. Test seeking with HTTP Range support, check playback on mobile devices, confirm captions are synchronized with that exact preview, and compare the download action against the original file URL. A compact H.264/AAC MP4 with its `moov` atom at the beginning is a broadly compatible option; choose bitrate and resolution from real device and network testing.
