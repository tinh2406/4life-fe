import * as React from "react";
import { Grid, TextField } from "@mui/material";
import classes from "./UserProfileForm.module.scss";
import { useEffect, useState } from "react";
import Avatar from "../../Avatar/Avatar";
import { getAvatarURL } from "../../../api/auth.api";
import useUpdateUserProfile from "../../../hooks/use-update-user-profile";
import { UserUpdate } from "../../../types/model/userUpdate";
import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../../store/acthAction";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import DefaultAvatar from "../../../assets/images/defaultAvatar.jpg";
import { RootState } from "../../../store";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { toast } from "react-toastify";

type SelectSmallProps = {
	handleChangeGender: (event: SelectChangeEvent) => void;
	genderOptions: { label: string; value: boolean | null }[];
	gender: boolean | null;
};

const SelectSmall = ({ handleChangeGender, genderOptions, gender }: SelectSmallProps) => {
	return (
		<FormControl className={classes.select} size="small">
			<InputLabel id="profile-gender-label">Gender</InputLabel>
			<Select
				labelId="profile-gender-label"
				id="profile-gender"
				label="Gender"
				value={gender === null ? "None" : gender.toString()}
				onChange={handleChangeGender}
			>
				{genderOptions.map(option => (
					<MenuItem key={option.label} value={option.value === null ? "None" : option.value.toString()}>{option.label}</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

const UserProfileForm = (): React.JSX.Element => {
	const [loadingUploadAvatar, setLoadingUploadAvatar] = useState(false);
	const [photoURL, setPhotoURL] = useState(null);
	const [isSaving, setIsSaving] = useState(false);
	const [isChanging, setIsChanging] = useState(false);
	const [dateOfBirth, setDateOfBirth] = useState<Dayjs | null>(null);
	const user = useSelector((state: RootState) => state.auth.login.currentUser);
	const dispatch = useDispatch();

	const [gender, setGender] = React.useState<boolean | null>(null);

	const genderOptions = [
		{ label: "None", value: null },
		{ label: "Male", value: true },
		{ label: "Female", value: false }
	];

	const handleChangeGender = (event: SelectChangeEvent) => {
		setIsChanging(true);
		const selectedValue = event.target.value;
		const selectedOption = genderOptions.find(option =>
			(option.value === null ? "None" : option.value.toString()) === selectedValue
		);
		if (selectedOption) setGender(selectedOption.value);
	};

	const [userUpdate, setUserUpdate] = useState<UserUpdate>({
		name: "",
		phoneNumber: "",
		avatar: "",
		dateOfBirth: null,
		gender: null,
		description: ""
	});

	const updateUserProfile = useUpdateUserProfile();

	useEffect(() => {
		setDateOfBirth(user?.dateOfBirth ? dayjs(user?.dateOfBirth) : null);
		setGender(user?.gender ?? null);
		setUserUpdate({
			name: user?.name ?? "",
			phoneNumber: user?.phoneNumber ?? "",
			avatar: user?.avatar ?? "",
			dateOfBirth: user?.dateOfBirth ?? null,
			gender: user?.gender ? true : false,
			description: user?.description ?? ""
		});
	}, [user]);

	const handleChangeAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target?.files?.[0];
		if (!file) return;
		setLoadingUploadAvatar(true);
		setIsChanging(true);
		const reader = new FileReader();
		reader.onload = async () => {
			try {
				const formData = new FormData();
				formData.append("file", file);
				const res = await getAvatarURL(formData);
				setPhotoURL(res.data.url);
			} catch {
				toast.error("Could not upload profile photo. Please try again.");
			} finally {
				setLoadingUploadAvatar(false);
			}
		};
		reader.onerror = () => {
			setLoadingUploadAvatar(false);
			toast.error("Could not read this photo. Please choose another file.");
		};
		reader.readAsDataURL(file);
		event.target.value = "";
	};

	const handleFieldChange = (fieldName: string, value: string) => {
		setIsChanging(true);
		setUserUpdate({
			...userUpdate,
			[fieldName]: value
		});
	};

	const handleSave = async () => {
		setIsSaving(true);
		const data = {
			...userUpdate,
			gender: gender,
			avatar: photoURL ?? user?.avatar ?? "",
			dateOfBirth: dateOfBirth?.format("YYYY-MM-DD") ?? null
		};
		try {
			await updateUser(data, dispatch);
			await updateUserProfile.mutateAsync(data);
		} catch (error) {
			console.log(error);
		} finally {
			setIsSaving(false);
			setIsChanging(false);
		}
	};

	return (
		<Grid container className={classes.wrapperUserProfile}>
			<Grid item xs={12} className={classes.title}>
				Personal information
			</Grid>
			<Grid item xs={12} className={classes.wrapperFormUser}>
				<form>
					<Grid item xs={12} className={classes.wrapperAvatar}>
						<Avatar
							loadingUploadAvatar={loadingUploadAvatar}
							handleChangeAvatar={handleChangeAvatar}
							photoURL={photoURL ? photoURL : user?.avatar ? user?.avatar : DefaultAvatar}
						/>
					</Grid>
					<Grid item xs={12} className={classes.wrapperRowInput}>
						<Grid item xs={5} className={classes.wrapperInput}>
							<label className={classes.text} htmlFor="profile-name">Name</label>
							<TextField
								id="profile-name"
								variant="outlined"
								size="small"
								className={classes.inputField}
								value={userUpdate?.name ?? ""}
								onChange={e => handleFieldChange("name", e.target.value)}
							/>
						</Grid>
						<Grid item xs={5} className={classes.wrapperInput}>
							<label className={classes.text} htmlFor="profile-email">Email</label>
							<TextField
								id="profile-email"
								variant="outlined"
								size="small"
								className={classes.inputField}
								value={user?.email ?? ""}
								disabled={true}
							/>
						</Grid>
					</Grid>
					<Grid item xs={12} className={classes.wrapperRowInput}>
						<Grid item xs={5} className={classes.wrapperInput}>
							<label className={classes.text} htmlFor="profile-phone">Phone Number</label>
							<TextField
								id="profile-phone"
								variant="outlined"
								size="small"
								className={classes.inputField}
								value={userUpdate?.phoneNumber ?? ""}
								onChange={e => handleFieldChange("phoneNumber", e.target.value)}
							/>
						</Grid>
						<Grid item xs={5} className={classes.wrapperInput}>
							<SelectSmall
								handleChangeGender={handleChangeGender}
								genderOptions={genderOptions}
								gender={gender}
							/>
						</Grid>
					</Grid>
					<Grid item xs={12} className={classes.wrapperRowInput}>
						<Grid item xs={5} className={classes.wrapperInput}>
							<label className={classes.text} htmlFor="profile-description">Description</label>
							<TextField
								id="profile-description"
								variant="outlined"
								size="small"
								className={classes.inputField}
								value={userUpdate?.description ?? ""}
								onChange={e => handleFieldChange("description", e.target.value)}
							/>
						</Grid>
						<Grid item xs={5} className={classes.wrapperInput}>
							<label className={classes.text} htmlFor="profile-date-of-birth">Date Of Birth</label>
							<DatePicker
								slotProps={{
									textField: {
										id: "profile-date-of-birth",
										size: "small",
										variant: "outlined",
									}
								}}
								format="YYYY-MM-DD"
								value={dateOfBirth}
								onChange={date => {
									setDateOfBirth(dayjs(date));
									setIsChanging(true);
								}}
								className={classes.datePicker}
							/>
						</Grid>
					</Grid>
					<Grid item xs={12} className={classes.wrapperButton}>
						<LoadingButton
							size="small"
							className={classes.buttonSave}
							onClick={handleSave}
							loading={isSaving}
							loadingPosition="start"
							startIcon={<SaveIcon />}
							variant="contained"
							disabled={!isChanging}
						>
							<span>Save</span>
						</LoadingButton>
					</Grid>
				</form>
			</Grid>
		</Grid>
	);
};

export default UserProfileForm;
