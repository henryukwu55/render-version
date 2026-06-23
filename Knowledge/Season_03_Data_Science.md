# Season 03 Data Science Projects

---

Project Name: Drive Me Crazy
Project Submission: Submit files dataset_analysis.ipynb | presentation.txt | lookerstudio_url.txt | drive_me_crazy_tradi.ipynb | drive_me_crazy_pdformer.ipynb
Project Description: Develop a robust traffic flow prediction system using the Propagation Delay-Aware Dynamic Long-Range Transformer method. Use PeMS04 PeMS07 PeMS08 and NYCTaxi datasets to forecast traffic flow in urban areas considering propagation delays. Build an interactive Looker Studio dashboard to visualize predictions.
Examples: Traditional model baseline on PeMS datasets | PDFormer model implementation from arxiv paper 2301.07945 | Evaluation using MAE and RMSE metrics | Looker Studio dashboard with interactive visualizations
Hints: Paper reference: https://arxiv.org/pdf/2301.07945v2.pdf | Do not push datasets to git — automatic rejection | Datasets found online: PeMS04 PeMS07 PeMS08 NYCTaxi | Compare PDFormer vs traditional model performance
You can do: Download PeMS and NYCTaxi datasets | Implement traditional prediction baseline | Implement PDFormer model | Evaluate with MAE and RMSE | Build Looker Studio dashboard | Analyze propagation delay impact
You cannot do: Push datasets to git repository
Project Technical Specification: Language matches your bootcamp track. Deliverables: dataset analysis notebook, traditional model notebook, PDFormer model notebook, propagation delay analysis paper, Looker Studio dashboard, presentation comparing models.
Common Mistakes: Pushing datasets to git causes automatic rejection | Not comparing against traditional baseline | Missing Looker Studio dashboard URL | Incomplete deliverables list

---

Project Name: A Fool Fraud
Project Submission: Submit files dataset_analysis.ipynb | presentation.txt | a_fool_fraud_tradi.ipynb | a_fool_fraud_data_augmentation.ipynb
Project Description: Enhance credit card fraud detection using data augmentation techniques. Address imbalanced datasets where fraudulent transactions are rare. Implement SMOTE ADASYN and GANs to generate synthetic minority class samples. Compare augmented models against baseline.
Examples: SMOTE oversamples minority fraud class | ADASYN adaptive synthetic sampling | GAN generates realistic synthetic fraud samples | Evaluate with accuracy precision recall F1 and AUC-ROC | Dataset from https://storage.googleapis.com/qwasar-public/track-ds/creditcard.csv
Hints: Do not push dataset to git — automatic rejection | Address class imbalance carefully | Monitor for overfitting on validation set | Ensure data privacy and anonymization | Examine augmented data for introduced biases
You can do: SMOTE | ADASYN | GANs | Logistic Regression | Random Forest | SVM | GBM | Data augmentation | Bias analysis
You cannot do: Push datasets to git | Use sensitive unanonymized data
Project Technical Specification: Language matches your bootcamp track. Deliverables: dataset analysis notebook, traditional prediction notebook, data augmentation notebook, presentation comparing model performance.
Common Mistakes: Pushing dataset to git causes automatic rejection | Not comparing augmented vs baseline | Introducing bias through augmentation without checking | Overfitting on augmented data

---

Project Name: Coleridge Initiative
Project Submission: Submit files dataset_analysis.ipynb | presentation.txt | coleridge_initiative_model.ipynb
Project Description: Use NLP and deep learning to identify how scientific datasets are referenced in academic articles. Implement BiLSTM and GRU recurrent networks and sep-CNN convolutional network and spaCy NER to detect dataset mentions in scientific text.
Examples: BiLSTM captures sequential patterns in scientific text | GRU alternative recurrent approach | sep-CNN identifies local text features | spaCy NER tags dataset mentions as named entities | Data from Kaggle Coleridge Initiative competition
Hints: Goal is to generalize to unseen datasets not just known ones | N-gram models help identify word sequence patterns | Focus on text preprocessing and sequence labeling | Not required to submit to Kaggle competition
You can do: BiLSTM | GRU | sep-CNN | spaCy NER | N-gram models | Text preprocessing | Named entity recognition
You cannot do: Simply memorize known dataset names without generalization
Project Technical Specification: Language matches your bootcamp track. Deliverables: dataset analysis notebook, prediction model notebook, presentation comparing model performance.
Common Mistakes: Overfitting to known dataset names | Not preprocessing text properly | Not comparing multiple model approaches | Missing analysis of which model generalizes best
