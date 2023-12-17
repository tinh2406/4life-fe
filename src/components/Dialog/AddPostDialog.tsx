import React, { useCallback, useEffect, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import classes from "./AddPostDialog.module.scss";
import DialogTitle from "@mui/material/DialogTitle";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, FieldValues, SubmitHandler, useForm } from "react-hook-form";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import SelectOption from "../SelectOption/SelectOption";
import useLocations from "../../hooks/use-locations";
import useAmenities from "../../hooks/use-amenities";
import { convertFormatTime, transformAmenityOptions, transformLocationOptions } from "../../utils/mapper";
import { Autocomplete, Checkbox, FormControlLabel, FormGroup, IconButton, TextField } from "@mui/material";
import UploadImageAccomodation from "../UploadImageAccommodation/UploadImageAccomodation";
import { getAvatarURL } from "../../api/auth.api";
import { schemaAddPostFrom } from "../../utils/get-schema-login-form";
import { Accommodation } from "../../types/model/accommodation";
import { LoadingButton } from "@mui/lab";
import useCreateAccommodation from "../../hooks/use-create-accommodation";
import MapContainer from "../Map/Map";
import useAccommodationDetail from "../../hooks/use-accomodation-detail";
import { AccommodationUpdate } from "../../types/model/AccommodationUpdate";
// import useAmenitiesOfAccommodation from "../../hooks/use-amenities-of-accommodation";
import useUpdateAccommodation from "../../hooks/use-update-accommodation";
import useUpdateAmentitiesAccommodation from "../../hooks/use-update-amentities-accommodation";

interface AddPostModalProps {
	open: boolean;
	isEdit: boolean;
	setIsEdit: (isEdit: boolean) => void;
	idAccommodation: number;
	setIdAccommodation: (idAccommodation: number) => void;
	handleClose: () => void;
}

const AddPostDialog = ({
	open,
	isEdit,
	setIsEdit,
	idAccommodation,
	setIdAccommodation,
	handleClose
}: AddPostModalProps): React.JSX.Element => {
	// const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
	const [photoURLs, setPhotoURLs] = useState<string[]>([]);
	const [amentitiesIds, setAmentitiesIds] = useState<number[]>([]);
	const { data: dataAccommodation } = useAccommodationDetail(idAccommodation);
	console.log("dataAccommodation", dataAccommodation);
	// const { data: dataAmentities } = useAmenitiesOfAccommodation(idAccommodation);
	const updateAccommodation = useUpdateAccommodation();
	const updateAmentitiesAccommodation = useUpdateAmentitiesAccommodation();

	const [optionalForm, setOptionalForm] = useState({
		description: "",
		price: 0,
		maxGuests: 0,
		numberOfBeds: 0,
		numberOfBedrooms: 0,
		numberOfBathrooms: 0,
		allowPets: false,
		allowSmoking: false,
		allowEvents: false,
		allowPhoto: false
	});

	const handleChangeAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target?.files?.[0];
		setLoadingUpload(true);
		if (file) {
			const reader = new FileReader();
			reader.onload = async (e: ProgressEvent<FileReader>) => {
				console.log(e.target?.result);
				const formData = new FormData();
				formData.append("file", file);
				const res = await getAvatarURL(formData);
				setPhotoURLs([...photoURLs, res.data.url]);
				setLoadingUpload(false);
			};
			reader.readAsDataURL(file);
			event.target.value = "";
		}
	};

	const {
		control,
		register,
		formState: { errors },
		handleSubmit,
		reset,
		setValue,
		getValues
	} = useForm({ resolver: yupResolver(schemaAddPostFrom) });

	const typeOptions = useMemo(
		() => [
			{ value: 5, label: "Motel" },
			{ value: 2, label: "Homestay" },
			{ value: 3, label: "Resort" },
			{ value: 4, label: "Villa" }
		],
		[]
	);

	// const onCloseConfirmDialog = (): void => {
	// 	// setIsConfirmDialogOpen(false);
	// };

	// const onConfirmCancel = (): void => {
	// 	// setIsConfirmDialogOpen(false);
	// 	handleClose();
	// };

	const onCancelButtonClick = (): void => {
		handleClose();
		setIsEdit(false);
		setIdAccommodation(0);
		reset();
	};

	const handleDeletePhoto = (index: number) => {
		const updatedPhotos = [...photoURLs];
		updatedPhotos.splice(index, 1);
		setPhotoURLs(updatedPhotos);
	};

	const { data } = useLocations();
	const { data: dataAmenities } = useAmenities();
	const addAccommodation = useCreateAccommodation();

	const getTypeOfYourAccomadation = (value: number): string | null => {
		const selectedOption = typeOptions.find(option => option.value === value);
		return selectedOption ? selectedOption.label : null;
	};

	const getTypeValueFromLabel = useCallback(
		(label: string): number => {
			const selectedOption = typeOptions.find(option => option.label === label);
			return selectedOption ? selectedOption.value : 0;
		},
		[typeOptions]
	);

	const getAmenityIds = useCallback((): number[] => {
		dataAmenities?.map(item => {
			item.data.map(amenity => {
				if (amentitiesIds.includes(amenity.id)) {
					return;
				}
				setAmentitiesIds([...amentitiesIds, amenity.id]);
			});
		});
		return amentitiesIds;
	}, [amentitiesIds, dataAmenities]);

	useEffect(() => {
		getAmenityIds();
		setValue("name", dataAccommodation?.name ?? "");
		setValue("type", getTypeValueFromLabel(dataAccommodation?.type ?? ""));
		setValue("address", dataAccommodation?.address ?? "");
		setValue("location", dataAccommodation?.location?.id ?? 0);
		setValue("timeCheckinBefore", dataAccommodation?.checkInBefore ?? "");
		setValue("timeCheckinAfter", dataAccommodation?.checkInAfter ?? "");
		setValue("timeCheckoutBefore", dataAccommodation?.checkOutBefore ?? "");
		setValue("quiteTimeBefore", dataAccommodation?.quietHoursBefore ?? "");
		setValue("quiteTimeAfter", dataAccommodation?.quietHoursAfter ?? "");
		setPhotoURLs(dataAccommodation?.imageUrls ?? []);
		setOptionalForm({
			description: dataAccommodation?.description || "",
			price: dataAccommodation?.price || 0,
			maxGuests: dataAccommodation?.maxGuests || 0,
			numberOfBeds: dataAccommodation?.numberOfBeds || 0,
			numberOfBedrooms: dataAccommodation?.numberOfBedrooms || 0,
			numberOfBathrooms: dataAccommodation?.numberOfBathrooms || 0,
			allowPets: dataAccommodation?.isPetAllowed || false,
			allowSmoking: dataAccommodation?.isSmokingAllowed || false,
			allowEvents: dataAccommodation?.isEventAllowed || false,
			allowPhoto: dataAccommodation?.isPhotoAllowed || false
		});
	}, [
		setValue,
		dataAccommodation?.name,
		dataAccommodation?.type,
		dataAccommodation?.address,
		getTypeValueFromLabel,
		dataAccommodation?.location?.id,
		dataAccommodation?.checkInBefore,
		dataAccommodation?.checkInAfter,
		dataAccommodation?.checkOutBefore,
		dataAccommodation?.quietHoursBefore,
		dataAccommodation?.quietHoursAfter,
		dataAccommodation?.imageUrls,
		getAmenityIds,
		dataAccommodation?.description,
		dataAccommodation?.price,
		dataAccommodation?.maxGuests,
		dataAccommodation?.numberOfBeds,
		dataAccommodation?.numberOfBedrooms,
		dataAccommodation?.numberOfBathrooms,
		dataAccommodation?.isPetAllowed,
		dataAccommodation?.isSmokingAllowed,
		dataAccommodation?.isEventAllowed,
		dataAccommodation?.isPhotoAllowed
	]);

	const [selectedPlace, setSelectedPlace] = useState<{
		geometry: {
			location: {
				lat: number;
				lng: number;
			};
		};
		name: string;
	} | null>(null);

	const onSubmit: SubmitHandler<FieldValues> = async data => {
		setIsSubmitting(true);
		if (isEdit) {
			const accomodationUpdate = {
				name: getValues("name"),
				type: getTypeOfYourAccomadation(getValues("type")),
				description: optionalForm.description,
				maxGuests: optionalForm.maxGuests,
				price: optionalForm.price,
				checkInAfter: getValues("timeCheckinAfter"),
				checkInBefore: getValues("timeCheckinBefore"),
				checkOutBefore: getValues("timeCheckoutBefore"),
				isPetAllowed: optionalForm.allowPets,
				isSmokingAllowed: optionalForm.allowSmoking,
				isEventAllowed: optionalForm.allowEvents,
				isPhotoAllowed: optionalForm.allowPhoto,
				quietHoursAfter: getValues("quiteTimeAfter"),
				quietHoursBefore: getValues("quiteTimeBefore")
			} as AccommodationUpdate;
			const amentitiesUpdate = {
				accommodationId: idAccommodation,
				amenityIds: getValues("amentities")
			};
			updateAmentitiesAccommodation.mutateAsync(amentitiesUpdate);
			updateAccommodation.mutateAsync({ idAccommodation, accomodationUpdate });
			handleClose();
			setIsSubmitting(false);
		} else {
			const accommodation = {
				name: data.name,
				type: getTypeOfYourAccomadation(data.type),
				locationId: data.location,
				description: optionalForm.description,
				address: data.address,
				latitude: selectedPlace?.geometry.location.lat,
				longitude: selectedPlace?.geometry.location.lng,
				numberOfBeds: optionalForm.numberOfBeds,
				numberOfBedrooms: optionalForm.numberOfBedrooms,
				numberOfBathrooms: optionalForm.numberOfBathrooms,
				maxGuests: optionalForm.maxGuests,
				price: optionalForm.price,
				imageUrls: photoURLs,
				checkInAfter: convertFormatTime(data.timeCheckinAfter),
				checkInBefore: convertFormatTime(data.timeCheckinBefore),
				checkOutBefore: convertFormatTime(data.timeCheckoutBefore),
				isPetAllowed: optionalForm.allowPets,
				isSmokingAllowed: optionalForm.allowSmoking,
				isEventAllowed: optionalForm.allowEvents,
				isPhotoAllowed: optionalForm.allowPhoto,
				quietHoursAfter: convertFormatTime(data.quiteTimeAfter),
				quietHoursBefore: convertFormatTime(data.quiteTimeBefore),
				amenityIds: data.amentities
			} as Accommodation;
			console.log("addCcom", accommodation);
			try {
				addAccommodation.mutateAsync(accommodation);
				handleClose();
			} catch (error) {
				// toast.error(error.message);
			} finally {
				setIsSubmitting(false);
			}
		}
	};

	return (
		<>
			<Dialog open={open} scroll="paper" fullWidth maxWidth="md">
				<DialogTitle className={classes.dialog_title_wrapper}>
					{isEdit ? "Edit post" : "Add New Post"}
				</DialogTitle>
				<DialogContent dividers={true}>
					<form>
						<div className={classes.step}>
							Step 1: Share some necessary information about your accommodation
						</div>
						<div className={classes.wrapperInput}>
							<div className={classes.text}>Name</div>
							<TextField
								id="standard-basic1"
								variant="outlined"
								className={classes.inputField}
								error={!!errors.name}
								helperText={errors.name?.message}
								{...register("name")}
								placeholder="Enter your accommodation's name"
							/>
						</div>
						<div className={classes.wrapperInput}>
							<div className={classes.text}>Type Of Your Accomodation</div>
							<Controller
								name="type"
								control={control}
								render={({ field }) => (
									<SelectOption
										options={typeOptions}
										onChange={value => {
											field.onChange(value);
										}}
										value={getValues("type")}
									/>
								)}
							/>
							<div className={classes.error}>{errors.type?.message}</div>
						</div>
						<div className={classes.wrapperInput}>
							<div className={classes.text}>Description</div>
							<TextField
								id="standard-basic2"
								variant="outlined"
								className={classes.inputField}
								placeholder="Description"
								defaultValue={isEdit ? dataAccommodation?.description : ""}
								onChange={e => setOptionalForm({ ...optionalForm, description: e.target.value })}
							/>
						</div>
						<div className={classes.wrapperInput}>
							<div className={classes.text}>Address</div>
							<TextField
								id="standard-basic3"
								variant="outlined"
								className={classes.inputField}
								error={!!errors.address}
								helperText={errors.address?.message}
								{...register("address")}
								placeholder="Address"
							/>
						</div>
						<div className={classes.wrapperInput}>
							<div className={classes.text}>Price</div>
							<TextField
								id="standard-basic4"
								variant="outlined"
								type="number"
								className={classes.inputField}
								defaultValue={isEdit ? dataAccommodation?.price : 0}
								inputProps={{ min: 0 }}
								onChange={e => setOptionalForm({ ...optionalForm, price: +e.target.value })}
							/>
						</div>
						<div className={classes.wrapperInput}>
							<div className={classes.text}>Max Guests</div>
							<TextField
								id="standard-basic5"
								variant="outlined"
								type="number"
								className={classes.inputField}
								defaultValue={isEdit ? dataAccommodation?.maxGuests : 0}
								inputProps={{ min: 0 }}
								onChange={e => setOptionalForm({ ...optionalForm, maxGuests: +e.target.value })}
							/>
						</div>
						<div className={classes.wrapperInput}>
							<div className={classes.text}>Number Of Beds</div>
							<TextField
								id="standard-basic7"
								variant="outlined"
								type="number"
								className={classes.inputField}
								defaultValue={isEdit ? dataAccommodation?.numberOfBeds : 0}
								inputProps={{ min: 0 }}
								onChange={e => setOptionalForm({ ...optionalForm, numberOfBeds: +e.target.value })}
							/>
						</div>
						<div className={classes.wrapperInput}>
							<div className={classes.text}>Number Of Bedrooms</div>
							<TextField
								id="standard-basic8"
								variant="outlined"
								type="number"
								className={classes.inputField}
								defaultValue={isEdit ? dataAccommodation?.numberOfBedrooms : 0}
								inputProps={{ min: 0 }}
								onChange={e => setOptionalForm({ ...optionalForm, numberOfBedrooms: +e.target.value })}
							/>
						</div>
						<div className={classes.wrapperInput}>
							<div className={classes.text}>Number Of Bathrooms</div>
							<TextField
								id="standard-basic9"
								variant="outlined"
								type="number"
								className={classes.inputField}
								defaultValue={isEdit ? dataAccommodation?.numberOfBathrooms : 0}
								inputProps={{ min: 0 }}
								onChange={e => setOptionalForm({ ...optionalForm, numberOfBathrooms: +e.target.value })}
							/>
						</div>
						<div className={classes.wrapperInput}>
							<div className={classes.text}>Location</div>
							<Controller
								name="location"
								control={control}
								render={({ field }) => (
									<SelectOption
										options={transformLocationOptions(data ? data[0].data : [])}
										onChange={value => {
											field.onChange(value);
										}}
										value={getValues("location")}
									/>
								)}
							/>
						</div>
						<div className={classes.wrapperInput}>
							<div className={classes.text}>Latitue And Longtitue</div>
							<MapContainer selectedPlace={selectedPlace} setSelectedPlace={setSelectedPlace} />
						</div>
						<div className={classes.step}>Step 2: Set the rules for your accommodation</div>
						<div className={classes.wrapperTime}>
							<div className={classes.wrapperInput}>
								<div className={classes.text}>Time Checkin Before</div>
								<TextField
									id="standard-basic10"
									variant="outlined"
									type="time"
									className={classes.inputFieldTime}
									error={!!errors.timeCheckinBefore}
									helperText={errors.timeCheckinBefore?.message}
									{...register("timeCheckinBefore")}
								/>
							</div>
							<div className={classes.wrapperInput}>
								<div className={classes.text}>Time Checkin After</div>
								<TextField
									id="standard-basic11"
									variant="outlined"
									type="time"
									className={classes.inputFieldTime}
									error={!!errors.timeCheckinAfter}
									helperText={errors.timeCheckinAfter?.message}
									{...register("timeCheckinAfter")}
								/>
							</div>
						</div>
						<div className={classes.wrapperInput}>
							<div className={classes.text}>Time Checkout Before</div>
							<TextField
								id="standard-basic12"
								variant="outlined"
								type="time"
								className={classes.inputFieldTime}
								error={!!errors.timeCheckoutBefore}
								helperText={errors.timeCheckoutBefore?.message}
								{...register("timeCheckoutBefore")}
							/>
						</div>
						<div className={classes.wrapperTime}>
							<div className={classes.wrapperInput}>
								<div className={classes.text}>Quite Time Before</div>
								<TextField
									id="standard-basic13"
									variant="outlined"
									type="time"
									className={classes.inputFieldTime}
									error={!!errors.quiteTimeBefore}
									helperText={errors.quiteTimeBefore?.message}
									{...register("quiteTimeBefore")}
								/>
							</div>
							<div className={classes.wrapperInput}>
								<div className={classes.text}>Quite Time After</div>
								<TextField
									id="standard-basic14"
									variant="outlined"
									type="time"
									className={classes.inputFieldTime}
									error={!!errors.quiteTimeAfter}
									helperText={errors.quiteTimeAfter?.message}
									{...register("quiteTimeAfter")}
								/>
							</div>
						</div>
						<div>
							<FormGroup>
								<FormControlLabel
									control={
										<Checkbox
											checked={optionalForm.allowPets}
											onChange={e =>
												setOptionalForm({ ...optionalForm, allowPets: e.target.checked })
											}
										/>
									}
									label="Allow Pets"
								/>
								<FormControlLabel
									control={
										<Checkbox
											checked={optionalForm.allowSmoking}
											onChange={e =>
												setOptionalForm({ ...optionalForm, allowSmoking: e.target.checked })
											}
										/>
									}
									label="Allow Smoking"
								/>
								<FormControlLabel
									control={
										<Checkbox
											checked={optionalForm.allowEvents}
											onChange={e =>
												setOptionalForm({ ...optionalForm, allowEvents: e.target.checked })
											}
										/>
									}
									label="Allow Events"
								/>
								<FormControlLabel
									control={
										<Checkbox
											checked={optionalForm.allowPhoto}
											onChange={e =>
												setOptionalForm({ ...optionalForm, allowPhoto: e.target.checked })
											}
										/>
									}
									label="Allow Photo"
								/>
							</FormGroup>
						</div>
						<div className={classes.step}>Step 3: Make your accommodation stand out</div>
						<div className={classes.wrapperInput}>
							<div className={classes.text}>Amentities</div>
							<Controller
								name="amentities"
								control={control}
								defaultValue={transformAmenityOptions(dataAmenities ? dataAmenities[0].data : [])}
								render={({ field }) => (
									<Autocomplete
										multiple
										options={transformAmenityOptions(dataAmenities ? dataAmenities[0].data : [])}
										getOptionLabel={option => option.label}
										defaultValue={field.value}
										onChange={(_e, values) => {
											field.onChange(values.map(value => value.value || 0));
										}}
										renderInput={params => (
											<TextField {...params} placeholder="Amentities" variant="outlined" />
										)}
									/>
								)}
							/>
							<div className={classes.error}>{errors.amentities?.message}</div>
						</div>
						<div className={classes.wrapperInput}>
							<div className={classes.text}>Image Of Accommodation</div>
							<div className={classes.wrapperImage}>
								{photoURLs.map((photoURL, index) => (
									<div className={classes.imgContainer} key={index}>
										<img src={photoURL} alt="photo" className={classes.imgAccomodation} />
										<IconButton
											className={classes.deleteIcon}
											onClick={() => handleDeletePhoto(index)}
										>
											<CloseIcon />
										</IconButton>
									</div>
								))}
								<UploadImageAccomodation
									loadingUpload={loadingUpload}
									handleChangeImage={handleChangeAvatar}
								/>
							</div>
						</div>
					</form>
				</DialogContent>
				<DialogActions>
					<LoadingButton
						size="small"
						className={classes.buttonSave}
						onClick={e => handleSubmit(onSubmit)(e)}
						loading={isSubmitting}
						startIcon={<SaveIcon />}
						loadingPosition="start"
						variant="contained"
					>
						<span>Save</span>
					</LoadingButton>
					<Button variant="outlined" onClick={onCancelButtonClick} className={classes.buttonCancel}>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
			{/* <ConfirmDialog
				open={isConfirmDialogOpen}
				onClose={onCloseConfirmDialog}
				title="Confirm cancellation"
				message={"Do you want to cancel this form?"}
				onConfirm={onConfirmCancel}
			/> */}
		</>
	);
};

export default AddPostDialog;
