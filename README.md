# KeyLimePie

## Inspiration

KeyLimePie is inspired by the concept of self-improvement through awareness and gentle guidance. Unlike conventional productivity tools or certain existing solutions that employ intimidating strategies or require premium online subscriptions to evoke guilt in order to discourage undesirable online behavior, KeyLimePie aims to be a supportive companion for young college students and individuals looking to understand and improve their online habits. Just as the real Key lime pie, with its perfect balance of sweet and tart flavors, offers a refreshing and satisfying experience, KeyLimePie (the tool) aims to bring a similar sense of balance and satisfaction to the digital lives of its users, allowing the users to control the Key aspects in their lives while enjoying some pie (charts).

## What it does

- **Fully Local Operation:** KeyLimePie uses a fully local large language model (LLM) to ensure all data processing happens on the user's device, preserving privacy and control.
- **Content Categorization:** It categorizes website contents into distinct groups, providing a clear overview of online activity without external data transmission.
- **Insightful Analytics:** Offers statistics and insights into browsing habits by analyzing categorized actions, helping users identify areas for improvement.
- **Supportive Feedback:** Aims to foster a healthier digital environment through supportive, non-condescending feedback, encouraging productive online behavior.
- **User Autonomy Respect:** Designed to respect the user's autonomy and self-guidance capabilities, avoiding any guilt-inducing feedback.
- **Mindful Online Interaction:** Promotes a more mindful and intentional approach to internet usage, helping users cultivate better digital habits.

## How we built it

The backbone of KeyLimePie is the Chrome integration of Mistral-7b-instruct-0.2 model with llama.cpp with the processing of user actions entirely locally, without reliance on cloud-based processing. This setup not only ensures privacy but also allows for real-time processing and insights.

## Challenges we ran into

- Finding the right open-source LLM which generates outputs/judgements comparable with GPT-family do need some investigation and research.
- Deploying the open-source LLM to Win/MacOS while enabling GPU acceleration need some work.
- Chrome extension development, especially the privilege, is really time-consuming for us first-timers.

## Accomplishments that we're proud of

- **Fully Functional Local LLM Agent Integration:** KeyLimePie seamlessly integrated a fully functional local Large Language Model (LLM) agent API.
- **Full-Stack Challenge:** The project required expertise in both front-end, back-end, and AI development, and we're proud to have overcome these challenges to deliver a seamless user experience.
- **Privacy-Preserving Insights:** KeyLimePie ensures that users' data remains private and secure, reflecting our commitment to user autonomy and data protection.

## What we learned

- Chrome extension development
- Local LLM integration
- It is really hard to find a pun for 'Lime' in the name.

## What's next for KeyLimePie

- A finetuned model tailored to more accurately reflect individual user needs and preferences.
- A more detailed analysis framework for deeper insights into online behaviors.
- A recommender system 'XRay' explainer, designed to elucidate the underlying reasons behind the reason of some items appear in your browsing history.
- An attention redirection feature, offering timely, gentle nudges towards more productive or fulfilling online activities when users might be veering towards potential bad decisions.

## Built With

- javascript
- natural-language-processing
- python
