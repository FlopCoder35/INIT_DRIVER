import streamlit as st
import pandas as pd
from PIL import Image
import PyPDF2
import tempfile
import os
import matplotlib.pyplot as plt
import seaborn as sns

# Load the dataset
DATASET_PATH = "advanced_lab_dataset.csv"  # Ensure this file is in the same directory as app.py
try:
    df = pd.read_csv(DATASET_PATH)
except FileNotFoundError:
    st.error("Dataset file 'advanced_lab_dataset.csv' not found. Please ensure it is in the correct directory.")
    st.stop()

# Define normal ranges based on dataset (simplified approach: filter 'Normal' status rows)
normal_ranges = {}
for test_name in df['Test_Name'].unique():
    normal_data = df[(df['Test_Name'] == test_name) & (df['Status'] == 'Normal')]
    if not normal_data.empty:
        avg_value = normal_data['Value'].mean()
        unit = normal_data['Unit'].iloc[0]  # Assume unit is consistent for each test
        normal_ranges[test_name] = {"value": avg_value, "unit": unit}

# Example normal ranges derived from dataset (you can refine this logic)
NORMAL_VALUES = {k: v["value"] for k, v in normal_ranges.items()}

def extract_text_from_pdf(pdf_file):
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def extract_values_from_content(content, content_type):
    # Simplified extraction logic (you can enhance this based on your report format)
    extracted_data = {}
    lines = content.split("\n") if content_type == "text" else content  # For images, assume content is preprocessed text
    for line in lines:
        for test_name in normal_ranges.keys():
            if test_name.lower() in line.lower():
                # Extract the numeric value (basic regex or string parsing)
                words = line.split()
                for word in words:
                    try:
                        value = float(word)
                        extracted_data[test_name] = value
                        break
                    except ValueError:
                        continue
    return extracted_data

def analyze_medical_report(content, content_type):
    # Extract values from the uploaded content
    user_data = extract_values_from_content(content, content_type)
    
    if not user_data:
        return "Could not extract meaningful health parameters from the report. Please ensure the report contains clear test names and values."

    # Compare with dataset-derived normal ranges
    analysis = "Analysis Results:\n\n"
    for test_name, user_value in user_data.items():
        if test_name in normal_ranges:
            normal_value = normal_ranges[test_name]["value"]
            unit = normal_ranges[test_name]["unit"]
            status = "Normal" if abs(user_value - normal_value) < 0.1 * normal_value else "Abnormal"
            analysis += (
                f"{test_name}: {user_value} {unit}\n"
                f" - Normal Range (from dataset): ~{normal_value:.2f} {unit}\n"
                f" - Status: {status}\n\n"
            )
        else:
            analysis += f"{test_name}: {user_value} (No reference range found in dataset)\n\n"
    
    return analysis

def plot_comparison_graphs(user_data):
    categories = list(user_data.keys())
    user_values = [user_data[key] for key in categories]
    normal_values = [normal_ranges.get(key, {"value": 0})["value"] for key in categories]

    plt.figure(figsize=(8, 5))
    sns.barplot(x=categories, y=user_values, color='blue', label='Your Values')
    sns.barplot(x=categories, y=normal_values, color='red', alpha=0.6, label='Normal Values')
    
    plt.ylabel("Measured Values")
    plt.title("Comparison of Your Health Data vs Dataset Normal Ranges")
    plt.xticks(rotation=45)
    plt.legend()
    st.pyplot(plt)

def main():
    st.title("AI-driven Medical Report Analyzer (Dataset-Based)")
    st.write("Upload a medical report (image or PDF) for analysis and comparison with dataset-derived health values.")

    file_type = st.radio("Select file type:", ("Image", "PDF"))

    if file_type == "Image":
        uploaded_file = st.file_uploader("Choose a medical report image", type=["jpg", "jpeg", "png"])
        if uploaded_file is not None:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as tmp_file:
                tmp_file.write(uploaded_file.getvalue())
                tmp_file_path = tmp_file.name

            image = Image.open(tmp_file_path)
            st.image(image, caption="Uploaded Medical Report", use_column_width=True)

            if st.button("Analyze Image Report"):
                with st.spinner("Analyzing the medical report image..."):
                    # For simplicity, assume text is extracted manually or via OCR (not implemented here)
                    placeholder_text = "Hemoglobin 15.5\nCholesterol_Total 180\nGlucose_Fasting 95"  # Replace with OCR if needed
                    analysis = analyze_medical_report(placeholder_text, "text")
                    st.subheader("Analysis Results:")
                    st.write(analysis)
                    user_data = extract_values_from_content(placeholder_text, "text")
                    if user_data:
                        plot_comparison_graphs(user_data)

            os.unlink(tmp_file_path)

    else:  # PDF
        uploaded_file = st.file_uploader("Choose a medical report PDF", type=["pdf"])
        if uploaded_file is not None:
            st.write("PDF uploaded successfully")

            if st.button("Analyze PDF Report"):
                with st.spinner("Analyzing the medical report PDF..."):
                    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
                        tmp_file.write(uploaded_file.getvalue())
                        tmp_file_path = tmp_file.name

                    with open(tmp_file_path, 'rb') as pdf_file:
                        pdf_text = extract_text_from_pdf(pdf_file)

                    analysis = analyze_medical_report(pdf_text, "text")
                    st.subheader("Analysis Results:")
                    st.write(analysis)

                    user_data = extract_values_from_content(pdf_text, "text")
                    if user_data:
                        st.subheader("Comparison with Normal Values:")
                        plot_comparison_graphs(user_data)
                        st.download_button("📥 Download Analysis Report", analysis, file_name="report_analysis.txt")
                    
                    os.unlink(tmp_file_path)

if __name__ == "__main__":
    main()