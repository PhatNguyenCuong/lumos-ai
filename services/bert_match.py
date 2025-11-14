import os
import sys
import json
import time
import pandas as pd
from transformers import BertTokenizer, BertModel
import torch
from sklearn.metrics.pairwise import cosine_similarity
import pdfplumber
import numpy as np

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased')

def dict_to_text(data):
    text = ""
    for key, value in data.items():
        if isinstance(value, str):
            text += f"{key}: {value}\n"
        elif isinstance(value, list):
            text += f"{key}:\n"
            for item in value:
                if isinstance(item, str):
                    text += f"- {item}\n"
                elif isinstance(item, dict):
                    text += f"- {dict_to_text(item)}\n"
        elif isinstance(value, dict):
            text += f"{key}:\n{dict_to_text(value)}\n"
    return text

def matching_with_BERT(cv_text, jd_text):
  start_time = time.time()

  # Process CV with BERT
  inputs_cv = tokenizer(cv_text, return_tensors="pt", truncation=True, max_length=512)
  with torch.no_grad():
      cv_embeddings = model(**inputs_cv).last_hidden_state.mean(dim=1)


  # Process job description with BERT
  inputs_jd = tokenizer(jd_text, return_tensors="pt", truncation=True, max_length=512)
  with torch.no_grad():
      jd_embeddings = model(**inputs_jd).last_hidden_state.mean(dim=1)

  # Calculate cosine similarity
  similarity = cosine_similarity(cv_embeddings.numpy(), jd_embeddings.numpy())
  matching_percent = similarity[0][0] * 100

  end_time = time.time()
  processing_time = end_time - start_time

  print(f"Matching Percentage: {matching_percent:.2f}%")
  print(f"Processing Time: {processing_time:.2f} seconds")

  return matching_percent, processing_time


def matching(cv_text, jd_text):
    # cv_text = dict_to_text(cv_text)
    # jd_text = dict_to_text(jd_text)

    percent, processing_time = matching_with_BERT(cv_text, jd_text)

    return {
        "matching_percentage": float(round(percent, 2)),
        "processing_time": float(round(processing_time, 2))
    }

if __name__ == "__main__":
    input_json = json.loads(sys.stdin.read())
    result = matching(input_json["cv_text"], input_json["jd_text"])
    print(json.dumps(result))

