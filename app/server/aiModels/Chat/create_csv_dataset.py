import pandas as pd

def combine_csv_files(file_paths, output_file):
    """
    Combine multiple CSV files into a single CSV file.

    Parameters:
        file_paths (list): List of file paths to the CSV files to combine.
        output_file (str): Path to the output CSV file.

    Returns:
        None
    """
    # Initialize an empty list to store dataframes
    dataframes = []

    # Load each CSV into a dataframe and append it to the list
    for file_path in file_paths:
        try:
            df = pd.read_csv(file_path)
            dataframes.append(df)
        except Exception as e:
            print(f"Error loading {file_path}: {e}")

    # Combine all dataframes into a single dataframe
    combined_dataset = pd.concat(dataframes, ignore_index=True)

    # Save the combined dataset to the output file
    combined_dataset.to_csv(output_file, index=False)
    print(f"Combined dataset saved to {output_file}")

# Example usage
if __name__ == "__main__":
    # List of input CSV file paths
    csv_files = [
        "datasets/animals.csv",
        "datasets/cooking.csv",
        "datasets/entertainment.csv",
        "datasets/family.csv",
        "datasets/greetings.csv",
        "datasets/health.csv",
        "datasets/hobbies.csv",
        "datasets/memory.csv",
        "datasets/nature.csv",
        "datasets/old_times.csv",
        "datasets/pets.csv",
        "datasets/preferences.csv",
        "datasets/professions.csv",
        "datasets/social_interaction.csv",
        "datasets/travel.csv",
    ]

    # Output CSV file path
    output_csv = "elderly_dataset.csv"

    # Combine the CSV files
    combine_csv_files(csv_files, output_csv)