# Daymark — Development audit

## 1. Initial prompt and first version

I asked ChatGPT/Codex to help build an original Chrome extension inspired by Momentum. My initial request included:

> It needs to be an extension similar to Momentum. First thing that I would like to do is define the features the extension could have. I want it to be original, so propose me some original features that it might include and then we can go ahead with the building process

I then requested a focus mode with website blocking, focus sounds or music options, and landscape backgrounds or uploaded photos. The first version included a focus timer, blocking controls, task suggestions, backgrounds and audio controls. The delivered music feature uses saved Spotify/Apple Music links, rather than connecting to those accounts.

## 2. Testing and issues found

I loaded the extension in Chrome and tried its interface. The “Add task” button extended outside its panel, and the central task section did not clearly explain what users should do or how it related to the focus timer. I supplied a screenshot showing the layout problem.

Installation also caused confusion: Chrome's folder picker showed folders rather than individual files, and the downloaded directory could have a different name from the instructions.

## 3. Request for corrections

I reported the interface issues with this prompt:

> there is stuff to fix. First, the "Add task" gets out of the rectangle. Also, better explain me what is the purpose of the central part and make it more intuitive for the user.

I also asked which folder to select when loading the unpacked extension.

## 4. Fixes and result after testing again

- **Layout:** the cramped task form was reorganised, with a full-width “Add to my tasks” button on its own row.
- **Clarity:** the task panel was divided into labelled steps for adding a task and choosing the next one. Instructions explain that “Use task” fills the focus panel and that “Begin focus” starts the timer.
- **Installation:** the instructions identify the correct directory by the presence of `manifest.json`, including GitHub's extracted folder name.

I checked the updated interface and confirmed that it was satisfactory. The later screenshots show the button contained within its panel, clearer task fields and a separate suggestion area. I also supplied screenshots showing an active focus timer and Instagram blocked, and confirmed the backup-restoration check. These are observations from my Chrome checks, not a claim that every browser scenario was tested.
