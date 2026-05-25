-----------------------------------
BACHELOR'S STUDENT QWASAR AND SEASON 03 DS PROJECT CONTEXT
---

=================
Season 03 DS
=================

Season03 DS Project 1:

Drive Me Crazy

Technical details
Submit files dataset_analysis.ipynb - presentation.txt - lookerstudio_url.txt - drive_me_crazy_tradi.ipynb - drive_me_crazy_pdformer.ipynb
Languages It needs to be completed in the language you are working on right now. If you are doing Bootcamp Javascript, then javascript (file extension will be .js). If you are doing Bootcamp Ruby, then Ruby (file extension will be .rb). It goes the same for Python, Java, C++, Rust, ...
The objective of this project is to develop a robust traffic flow prediction system using the "Propagation Delay-Aware Dynamic Long-Range Transformer" method. The system will utilize data from PeMS04, PeMS07, PeMS08, and NYCTaxi datasets to forecast traffic flow patterns accurately in urban areas while considering propagation delays. Additionally, one of the deliverables of the project will be the development of an interactive dashboard using Looker Studio to visualize and present the traffic flow predictions.

Objectives
The main objectives of the project are as follows:

Download the PeMS04, PeMS07, PeMS08, and NYCTaxi datasets. You will find them in the Internet. Implement a "traditional" prediction model on those datasets to predict traffic.

Implement the "Propagation Delay-Aware Dynamic Long-Range Transformer" and you will test it on those models. (https://arxiv.org/pdf/2301.07945v2.pdf) Evaluate the model's predictive performance and compare it against traditional traffic prediction methods. Investigate the impact of propagation delays on the accuracy of traffic flow predictions using real-world data.

Analyze the efficiency of dynamic long-range transformers in capturing temporal and spatial dependencies across diverse urban traffic scenarios. Develop an interactive dashboard using Looker Studio to visualize and present the traffic flow predictions.

Methodology
The project will follow these essential steps:

Data Integration: Combine the PeMS04, PeMS07, PeMS08, and NYCTaxi datasets to create a unified traffic data collection.
Data Preprocessing: Cleanse, aggregate, and preprocess the integrated data to remove inconsistencies and prepare it for training.
Model Adaptation: Customize the "Propagation Delay-Aware Dynamic Long-Range Transformer" model to accommodate the characteristics of the combined dataset.
Model Training: Train the adapted model using appropriate data science libraries, considering relevant traffic features and historical patterns.
Model Evaluation: Assess the model's predictive accuracy using metrics such as Mean Absolute Error (MAE) and Root Mean Squared Error (RMSE).
Comparison Analysis: Compare the performance of the proposed model with traditional traffic prediction approaches using the same datasets.
Propagation Delay Investigation: Analyze the influence of propagation delays on traffic flow predictions and identify potential challenges or bias.
Transformer Efficiency Analysis: Investigate the effectiveness of dynamic long-range transformers in capturing traffic patterns across different datasets.
Looker Studio Dashboard: Design and build an interactive Looker Studio dashboard to visualize and present the traffic flow predictions and model evaluation results.
Deliverables
We would like you to complete the following:

An analysis of the dataset.
A traditional traffic flow prediction model. (A jupyter notebook.)
An implemented "Propagation Delay-Aware Dynamic Long-Range Transformer" model tailored for accurate traffic flow prediction. (A jupyter notebook.)
Analysis of the impact of propagation delays on traffic flow prediction accuracy. (A paper about your findings)
An interactive Looker Studio dashboard showcasing traffic flow predictions and model evaluation results.
A presentation reports comparing the model's performance against traditional traffic prediction methods using various datasets.
Insights into the efficiency of dynamic long-range transformers in capturing diverse urban traffic patterns.
Make sure you don't push the dataset(s) to git, it will be an automatic rejection.

Season03 DS Project 2:

A Fool Fraud

Technical details
Submit files dataset_analysis.ipynb - presentation.txt - a_fool_fraud_tradi.ipynb - a_fool_fraud_data_augmentation.ipynb
Languages It needs to be completed in the language you are working on right now. If you are doing Bootcamp Javascript, then javascript (file extension will be .js). If you are doing Bootcamp Ruby, then Ruby (file extension will be .rb). It goes the same for Python, Java, C++, Rust, ...

Email sounds You've Got Mail. This is a transcript from a meeting that senior leader at your company just had:

[Location: Conference Room]

[Attendees: Project Manager, Data Scientist (You), Chief Information Officer (CIO), Chief Risk Officer (CRO), and Head of Fraud Detection Department]

Project Manager (PM): Good morning, everyone! Thank you for joining us today. We have gathered here to discuss an exciting project that aims to enhance our credit card fraud detection capabilities using cutting-edge data augmentation techniques. I'll hand it over to our brilliant Data Scientist (DS) to present the project overview.

Data Scientist (You): Good morning, everyone! As PM mentioned, I'll be leading this project. Our primary goal is to improve the performance of our credit card fraud detection system by leveraging new data augmentation techniques. As we all know, credit card fraud is a growing concern, and we want to stay ahead of the curve.

CIO: That sounds promising. Can you tell us more about the data augmentation techniques you plan to use?

You: Of course! We'll explore state-of-the-art techniques like Synthetic Minority Over-sampling Technique (SMOTE), Adaptive Synthetic (ADASYN), and even delve into Generative Adversarial Networks (GANs) to generate synthetic samples of the minority class, which in our case, are fraudulent transactions. By increasing the diversity of our training data, we expect our models to better generalize and detect fraud with higher accuracy.

CRO: That's excellent! But how do we ensure that the augmented data doesn't introduce any biases?

You: An important question, indeed. We'll carefully examine the augmented data to mitigate any potential biases. Additionally, we'll monitor the performance of the models on a separate validation set to make sure we're not overfitting or introducing any unwanted biases.

Head of Fraud Detection Department: Will this project impact our existing fraud detection system?

You: Great question! Our intention is to enhance the current system, not replace it. We'll run experiments in parallel and compare the augmented models' performance with our baseline models. If the results are promising, we can integrate the improved model into our existing system.

CIO: Budget-wise, what do you need for this project?

You: The budget will be allocated for data acquisition, computational resources, and any other necessary expenses related to experimentation and analysis. We'll ensure to optimize costs while maintaining high-quality results.

CRO: What about ethical considerations? How will you address potential data privacy concerns?

You: Ethical considerations are paramount in this project. We'll strictly adhere to data privacy and confidentiality guidelines. All sensitive information will be anonymized and protected. Moreover, we'll address any potential biases introduced during data augmentation and ensure fairness and transparency in our approach.

PM: Fantastic! This project has the potential to significantly improve our fraud detection capabilities. Let's work together to make this a success. Are there any other questions or concerns before we wrap up?

[Attendees discuss any additional questions or clarifications]

PM: Thank you all for your valuable input. Let's get started on this exciting project. We'll schedule regular update meetings to keep everyone informed about the progress. If there are no further questions, this meeting is adjourned. Have a great day, everyone!

[The meeting ends with a sense of enthusiasm and anticipation for the successful completion of the project]

Technical Specification
This project aims to enhance the classification performance in credit card fraud detection by utilizing cutting-edge data augmentation techniques. The primary objective is to address the challenges posed by imbalanced datasets, where fraudulent transactions are significantly outnumbered by genuine ones, leading to biased model predictions and reduced accuracy.

The proposed methodology includes data collection, preprocessing, and exploration of state-of-the-art data augmentation techniques such as SMOTE, ADASYN, and GANs. These techniques will generate synthetic samples of the minority class, i.e., fraudulent transactions, increasing the diversity of the training data and improving model generalization.

A variety of machine learning algorithms will be evaluated, including Logistic Regression, Random Forest, SVM, and GBM. The models will be trained on both the original imbalanced dataset and the augmented dataset, with performance evaluation using accuracy, precision, recall, F1 score, and area under the ROC curve.

The project emphasizes ethical considerations, ensuring data privacy and addressing potential biases in the augmented data. Interpretability and explainability of the selected models will be explored to gain insights into fraud detection processes.

By integrating the improved model into the existing fraud detection system, this project will contribute to a safer financial environment and better protection against credit card fraud for consumers and financial institutions.

Deliverables
We would like you to complete the following:

An analysis of the dataset.
A prediction model. (jupyter notebook)
A presentation reports comparing the model's performance against traditional traffic prediction methods.
Dataset
https://storage.googleapis.com/qwasar-public/track-ds/creditcard.csv

Make sure you don't push the dataset(s) to git, it will be an automatic rejection.

Season03 DS Project 3:

Coleridge Initiative

Technical details
Submit files dataset_analysis.ipynb - presentation.txt - coleridge_initiative_model.ipynb
Languages It needs to be completed in the language you are working on right now. If you are doing Bootcamp Javascript, then javascript (file extension will be .js). If you are doing Bootcamp Ruby, then Ruby (file extension will be .rb). It goes the same for Python, Java, C++, Rust, ...

NLP-based Automated Dataset Discovery in Scientific Publications The primary objective of this project is to utilize Natural Language Processing (NLP) and deep learning to uncover how scientific datasets are referenced in a range of academic articles. This project will explore three different models: two Recurrent Neural Networks (RNNs), specifically Bidirectional Long Short-Term Memory (BiLSTM) and Gated Recurrent Unit (GRU), and one Convolutional Neural Network (CNN), specifically sep-CNN.

Data Source
The project leverages data from the Kaggle competition named "Coleridge Initiative". The purpose of this competition is to uncover how public data is being used in the scientific community and provide insight for governments to make more informed and transparent public investments. The competition also aims to automate the process of identifying what datasets are used in problem-solving, the metrics generated, and the leading researchers in the field.

The dataset consists of the full text of scientific articles from various research domains, sourced from CHORUS publisher members and other venues. The task is to identify the datasets that the authors of these publications have utilized in their work.

Methodology
The focus of this project is not just to detect known dataset strings but to generalize the capability to identify new, unseen datasets. To achieve this, a multi-faceted approach will be used:

N-gram models: To identify patterns and correlations in word sequences in scientific texts.
RNN Models: Implementation of two RNN models, Bidirectional LSTM and GRU, to capture sequential information in the text and classify them appropriately.
CNN Model: Deployment of a sep-CNN model to identify localized features in the text which could indicate a dataset mention.
spaCy NER: Use of the Named Entity Recognition (NER) feature in spaCy to tag and identify dataset mentions as named entities.
It should be noted that this project does not provide a solution for the Kaggle competition but rather serves as an exploration of different NLP and deep learning methodologies for text processing and sequence labeling in the context of scientific articles. This project will provide insights into how to process raw text data, identify relevant scientific articles, and classify them with predefined labels.

Expected Outcome
By the end of this project, we expect to demonstrate the effectiveness of NLP and deep learning techniques in automating the process of dataset identification in scientific texts. We also aim to uncover which of the applied models is the most effective in generalizing and identifying new, unseen datasets. The findings will contribute to the body of knowledge in the field and provide valuable insights for future research and applications.

Deliverables
We would like you to complete the following:

An analysis of the dataset.
A prediction model. (jupyter notebook)
A presentation reports comparing the model's performance against traditional traffic prediction methods.
Season 03 Data Science
Season 03 Data Science
Reward
