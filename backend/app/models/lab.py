from datetime import date, datetime
from decimal import Decimal
from sqlalchemy import ForeignKey, ForeignKeyConstraint, Numeric, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db import Base


class Biomarker(Base):
    __tablename__ = "biomarker"

    biomarker_id: Mapped[int] = mapped_column(primary_key = True)
    code: Mapped[str] = mapped_column(unique = True)
    name: Mapped[str]
    unit: Mapped[str]
    ref_low: Mapped[Decimal | None] = mapped_column(Numeric(10, 3))
    ref_high: Mapped[Decimal | None] = mapped_column(Numeric(10, 3))

    values: Mapped[list["LabValue"]] = relationship(back_populates = "biomarker")


class LabReport(Base):
    __tablename__ = "lab_report"

    report_id: Mapped[int] = mapped_column(primary_key = True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patient_profile.user_id"))
    status: Mapped[str] = mapped_column(server_default = "uploaded")
    collected_on: Mapped[date | None]
    uploaded_at: Mapped[datetime] = mapped_column(server_default = func.now())
    reviewed_by: Mapped[int | None] = mapped_column(ForeignKey("doctor_profile.user_id"))
    reviewed_at: Mapped[datetime | None]
    rejection_comment: Mapped[str | None]

    patient_profile: Mapped["PatientProfile"] = relationship(back_populates = "lab_reports")
    reviewer: Mapped["DoctorProfile | None"] = relationship(back_populates = "reviewed_lab_reports")
    files: Mapped[list["LabReportFile"]] = relationship(back_populates = "report")
    values: Mapped[list["LabValue"]] = relationship(back_populates = "report")


class LabReportFile(Base):
    __tablename__ = "lab_report_file"

    file_id: Mapped[int] = mapped_column(primary_key = True)
    report_id: Mapped[int] = mapped_column(ForeignKey("lab_report.report_id", ondelete = "CASCADE"))
    file_no: Mapped[int]
    original_filename: Mapped[str]
    content_type: Mapped[str] = mapped_column(server_default = "application/pdf")
    size_bytes: Mapped[int]
    storage_path: Mapped[str]
    uploaded_at: Mapped[datetime] = mapped_column(server_default = func.now())

    report: Mapped["LabReport"] = relationship(back_populates = "files")


class LabValue(Base):
    __tablename__ = "lab_value"
    # Složeni strani ključ: vrijednost i nalaz moraju pripadati istom pacijentu.
    __table_args__ = (
        ForeignKeyConstraint(
            ["report_id", "patient_id"],
            ["lab_report.report_id", "lab_report.patient_id"],
            ondelete = "CASCADE",
        ),
    )

    value_id: Mapped[int] = mapped_column(primary_key = True)
    report_id: Mapped[int]
    patient_id: Mapped[int]
    biomarker_id: Mapped[int] = mapped_column(ForeignKey("biomarker.biomarker_id"))
    value: Mapped[Decimal] = mapped_column(Numeric(12, 4))
    unit: Mapped[str]
    measured_on: Mapped[date]
    source: Mapped[str]
    status: Mapped[str] = mapped_column(server_default = "unconfirmed")
    original_value: Mapped[Decimal | None] = mapped_column(Numeric(12, 4))
    reviewed_by: Mapped[int | None] = mapped_column(ForeignKey("doctor_profile.user_id"))
    reviewed_at: Mapped[datetime | None]

    report: Mapped["LabReport"] = relationship(back_populates = "values")
    biomarker: Mapped["Biomarker"] = relationship(back_populates = "values")
    reviewer: Mapped["DoctorProfile | None"] = relationship(back_populates = "reviewed_lab_values")
