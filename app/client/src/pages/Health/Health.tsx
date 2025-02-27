import React, { useState, useEffect } from "react";
import { saveHealthData, getHealthData, HealthData } from "../../services/api";
import { useIonToast } from "@ionic/react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonFooter,
  IonBackButton,
  IonButtons,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import Menu from "../../components/Menu";

const Health: React.FC = () => {
  const [present] = useIonToast();
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [age, setAge] = useState<number>();
  const [gender, setGender] = useState<string>("");
  const [height, setHeight] = useState<number>();
  const [weight, setWeight] = useState<number>();
  const [systolic, setSystolic] = useState<number>();
  const [diastolic, setDiastolic] = useState<number>();
  const [glucose, setGlucose] = useState<number>();
  const [cholesterol, setCholesterol] = useState<number>();
  const [smoking, setSmoking] = useState<string>("never");
  const [active, setActive] = useState<number>(0);
  const [alcohol, setAlcohol] = useState<number>(0);

  // Error states
  const [errors, setErrors] = useState({
    age: "",
    height: "",
    weight: "",
    systolic: "",
    diastolic: "",
    glucose: "",
  });

  // Fetch health data on component mount
  useEffect(() => {
    const fetchHealthData = async () => {
      setIsLoading(true);
      try {
				const userId = parseInt(localStorage.getItem("loggedUserId") || "0", 10)
        const result = await getHealthData(userId);
        if (result.ok && result.data) {
          const data = result.data;
          // Set age, gender, height, weight
          setAge(data.age);
          setGender(data.gender);
          setHeight(data.height);
          setWeight(data.weight);

          // Set blood pressure
          setSystolic(data.systolic);
          setDiastolic(data.diastolic);

          // Handle potentially null or invalid values
          setGlucose(data.glucose || 0); // Set default if null

          // Map cholesterol value to match select options
          setCholesterol(
            data.cholesterol > 3 ? 3 : data.cholesterol > 1 ? 2 : 1,
          );

          // Handle null smoking status
          setSmoking(data.smoking || "never");

          // Set activity and alcohol with defaults
          setActive(data.active ?? 0);
          setAlcohol(data.alcohol ?? 0);
        }
      } catch (error) {
        console.error("Error fetching health data:", error);
        present({
          message: "Error loading health information",
          duration: 3000,
          position: "bottom",
          color: "danger",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHealthData();
  }, []);

  // Validation functions
  const validateAge = (value: number | undefined) => {
    if (!value) return "Age is required";
    if (value < 0 || value > 120) return "Age must be between 0 and 120";
    return "";
  };

  const validateHeight = (value: number | undefined) => {
    if (!value) return "Height is required";
    if (value < 50 || value > 250)
      return "Height must be between 50 and 250 cm";
    return "";
  };

  const validateWeight = (value: number | undefined) => {
    if (!value) return "Weight is required";
    if (value < 20 || value > 300)
      return "Weight must be between 20 and 300 kg";
    return "";
  };

  const validateBloodPressure = (
    systolic: number | undefined,
    diastolic: number | undefined,
  ) => {
    const errors = { systolic: "", diastolic: "" };

    if (!systolic) errors.systolic = "Systolic pressure is required";
    else if (systolic < 50 || systolic > 250)
      errors.systolic = "Systolic pressure must be between 50 and 250 mmHg";

    if (!diastolic) errors.diastolic = "Diastolic pressure is required";
    else if (diastolic < 30 || diastolic > 200)
      errors.diastolic = "Diastolic pressure must be between 30 and 200 mmHg";

    if (systolic && diastolic && systolic <= diastolic)
      errors.systolic = "Systolic must be greater than diastolic pressure";

    return errors;
  };

  const validateGlucose = (value: number | undefined) => {
    if (!value) return "Blood glucose is required";
    if (value < 50 || value > 400)
      return "Blood glucose must be between 50 and 400 mg/dL";
    return "";
  };

  // Validate all fields before submission
  const validateForm = () => {
    const ageError = validateAge(age);
    const heightError = validateHeight(height);
    const weightError = validateWeight(weight);
    const glucoseError = validateGlucose(glucose);
    const bpErrors = validateBloodPressure(systolic, diastolic);

    setErrors({
      age: ageError,
      height: heightError,
      weight: weightError,
      glucose: glucoseError,
      systolic: bpErrors.systolic,
      diastolic: bpErrors.diastolic,
    });

    return !(
      ageError ||
      heightError ||
      weightError ||
      glucoseError ||
      bpErrors.systolic ||
      bpErrors.diastolic
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      present({
        message: "Please correct the errors in the form",
        duration: 3000,
        position: "bottom",
        color: "danger",
      });
      return;
    }

		const userId = parseInt(localStorage.getItem("loggedUserId") || "0", 10)

    const healthData: HealthData = {
			userId: userId,
      age: age!,
      gender,
      height: height!,
      weight: weight!,
      systolic: systolic!,
      diastolic: diastolic!,
      glucose: glucose!,
      cholesterol: cholesterol || 1,
      smoking,
      active,
      alcohol,
    };

    const result = await saveHealthData(healthData);
    if (result.ok) {
      present({
        message: "Health information saved successfully",
        duration: 3000,
        position: "bottom",
        color: "success",
      });
    } else {
      present({
        message: `Error saving health information: ${result.error}`,
        duration: 3000,
        position: "bottom",
        color: "danger",
      });
    }
  };

  if (isLoading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            {/* <IonButtons slot="start">
              <IonBackButton defaultHref="/home" />
            </IonButtons> */}
            <IonTitle>Health Information</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="ion-text-center">
            <IonSpinner />
            <p>Loading health information...</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {/* <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons> */}
          <IonTitle>Health Information</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ "--background": "#EFEFEF", color: "black" }}>
				<div
					style={{
						textAlign: "center",
						marginTop: "3rem",
						marginBottom: "2rem",
					}}
				></div>

				<div
					style={{
						maxWidth: "800px",
						margin: "2rem auto",
						textAlign: "center",
						"--background": "#EFEFEF",
						color: "black",
					}}
				>
        <IonRefresher
          slot="fixed"
          onIonRefresh={async (event) => {
            try {
							const userId = parseInt(localStorage.getItem("loggedUserId") || "0", 10)
              const result = await getHealthData(userId);
              if (result.ok && result.data) {
                const data = result.data;
                setAge(data.age);
                setGender(data.gender);
                setHeight(data.height);
                setWeight(data.weight);
                setSystolic(data.systolic);
                setDiastolic(data.diastolic);
                setGlucose(data.glucose);
                setCholesterol(data.cholesterol || 1);
                setSmoking(data.smoking || "never");
                setActive(data.active || 0);
                setAlcohol(data.alcohol || 0);
              }
            } catch (error) {
              console.error("Error refreshing health data:", error);
              present({
                message: "Error refreshing health information",
                duration: 3000,
                position: "bottom",
                color: "danger",
              });
            } finally {
              event.detail.complete();
            }
          }}
        >
          <IonRefresherContent />
        </IonRefresher>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Personal Information</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
					<IonItem className="custom-input">
						<IonInput
							placeholder="Age"
              type="number"
              value={age}
              onIonChange={(e) => {
                const value = e.detail.value
                  ? parseInt(e.detail.value, 10)
                  : undefined;
                setAge(value);
                setErrors((prev) => ({ ...prev, age: validateAge(value) }));
              }}
              className={errors.age ? "ion-invalid" : ""}
            />
            {errors.age && (
              <div
                className="ion-padding-start"
                style={{ color: "var(--ion-color-danger)" }}
              >
                {errors.age}
              </div>
            )}
            </IonItem>

            <IonItem className="custom-input">
							<IonSelect
								className="custom-select"
								value={gender}
								placeholder="Gender"
								onIonChange={(e) => {
									if (e && e.detail) {
										const selectedValue = e.detail.value;
										setGender(selectedValue);
									}
								}}
								interface="popover"
								interfaceOptions={{ cssClass: "custom-popover" }}
							>
								<IonSelectOption value="male">Male</IonSelectOption>
								<IonSelectOption value="female">Female</IonSelectOption>
							</IonSelect>
						</IonItem>

						<IonItem className="custom-input">
							<IonInput
								placeholder="Height (cm)"
                type="number"
                value={height}
                onIonChange={(e) => {
                  const value = e.detail.value
                    ? parseInt(e.detail.value, 10)
                    : undefined;
                  setHeight(value);
                  setErrors((prev) => ({
                    ...prev,
                    height: validateHeight(value),
                  }));
                }}
                className={errors.height ? "ion-invalid" : ""}
              />
              {errors.height && (
                <div
                  className="ion-padding-start"
                  style={{ color: "var(--ion-color-danger)" }}
                >
                  {errors.height}
                </div>
              )}
            </IonItem>

            <IonItem className="custom-input">
              <IonInput
								placeholder="Weight (kg)"
                type="number"
                value={weight}
                onIonChange={(e) => {
                  const value = e.detail.value
                    ? parseInt(e.detail.value, 10)
                    : undefined;
                  setWeight(value);
                  setErrors((prev) => ({
                    ...prev,
                    weight: validateWeight(value),
                  }));
                }}
                //className={errors.weight ? "ion-invalid" : ""}
              />
              {errors.weight && (
                <div
                  className="ion-padding-start"
                  style={{ color: "var(--ion-color-danger)" }}
                >
                  {errors.weight}
                </div>
              )}
            </IonItem>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Blood Pressure</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
					<IonItem className="custom-input">
              <IonInput
								placeholder="Systolic (mmHg)"
                type="number"
                value={systolic}
                onIonChange={(e) => {
                  const value = e.detail.value
                    ? parseInt(e.detail.value, 10)
                    : undefined;
                  setSystolic(value);
                  const bpErrors = validateBloodPressure(value, diastolic);
                  setErrors((prev) => ({
                    ...prev,
                    systolic: bpErrors.systolic,
                  }));
                }}
                className={errors.systolic ? "ion-invalid" : ""}
              />
              {errors.systolic && (
                <div
                  className="ion-padding-start"
                  style={{ color: "var(--ion-color-danger)" }}
                >
                  {errors.systolic}
                </div>
              )}
            </IonItem>

						<IonItem className="custom-input">
							<IonInput
								placeholder="Diastolic (mmHg)"
                type="number"
                value={diastolic}
                onIonChange={(e) => {
                  const value = e.detail.value
                    ? parseInt(e.detail.value, 10)
                    : undefined;
                  setDiastolic(value);
                  const bpErrors = validateBloodPressure(systolic, value);
                  setErrors((prev) => ({
                    ...prev,
                    diastolic: bpErrors.diastolic,
                  }));
                }}
                className={errors.diastolic ? "ion-invalid" : ""}
              />
              {errors.diastolic && (
                <div
                  className="ion-padding-start"
                  style={{ color: "var(--ion-color-danger)" }}
                >
                  {errors.diastolic}
                </div>
              )}
            </IonItem>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Additional Health Metrics</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
						<IonItem className="custom-input">
              <IonInput
								placeholder="Blood Glucose Level (mg/dL)"
								className="custom-select"
                type="number"
                value={glucose}
                onIonChange={(e) => {
                  const value = e.detail.value
                    ? parseInt(e.detail.value, 10)
                    : undefined;
                  setGlucose(value);
                  setErrors((prev) => ({
                    ...prev,
                    glucose: validateGlucose(value),
                  }));
                }}
                className={errors.glucose ? "ion-invalid" : ""}
              />
              {errors.glucose && (
                <div
                  className="ion-padding-start"
                  style={{ color: "var(--ion-color-danger)" }}
                >
                  {errors.glucose}
                </div>
              )}
            </IonItem>

						<IonItem className="custom-input">
              <IonSelect
								placeholder="Cholesterol Level"
								className="custom-select"
                value={cholesterol}
                onIonChange={(e) => {
                  const value = e.detail.value;
                  if (value !== undefined && value !== null) {
                    setCholesterol(parseInt(value, 10));
                  }
                }}
              >
                <IonSelectOption value={1}>Normal</IonSelectOption>
                <IonSelectOption value={2}>Above Normal</IonSelectOption>
                <IonSelectOption value={3}>Well Above Normal</IonSelectOption>
              </IonSelect>
            </IonItem>

						<IonItem className="custom-input">
              <IonSelect
								placeholder="Smoking History"
								className="custom-select"
                value={smoking}
                onIonChange={(e) => setSmoking(e.detail.value)}
              >
                <IonSelectOption value="never">Never</IonSelectOption>
                <IonSelectOption value="former">Former Smoker</IonSelectOption>
                <IonSelectOption value="current">
                  Current Smoker
                </IonSelectOption>
              </IonSelect>
            </IonItem>

						<IonItem className="custom-input">
              <IonSelect
              	placeholder="Activity"								
	              className="custom-select"
                value={active}
                onIonChange={(e) => setActive(parseInt(e.detail.value, 10))}
              >
                <IonSelectOption value={0}>Inactive</IonSelectOption>
                <IonSelectOption value={1}>Active</IonSelectOption>
              </IonSelect>
            </IonItem>

						<IonItem className="custom-input">
              <IonSelect
								placeholder="Alcohol Consumption"
								className="custom-select"
                value={alcohol}
                onIonChange={(e) => setAlcohol(parseInt(e.detail.value, 10))}
              >
                <IonSelectOption value={0}>None</IonSelectOption>
                <IonSelectOption value={1}>Moderate</IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonCardContent>
        </IonCard>

        <div className="ion-padding">
          <IonButton expand="block" onClick={handleSubmit}>
            Save Health Information
          </IonButton>
        </div>
				</div>
      </IonContent>

      <IonFooter translucent={true}>
        <Menu />
      </IonFooter>
    </IonPage>
  );
};

export default Health;
