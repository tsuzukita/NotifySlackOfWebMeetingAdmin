using FluentValidation;

namespace NotifySlackOfWebMeetingAdmin.Apis.Entities
{
    public class UserValidator : AbstractValidator<User>
    {
        public UserValidator()
        {
            // ユーザー名が未指定の場合はNGとする。
            RuleFor(user => user.Name).NotNull().NotEmpty().WithMessage("name is null or empty");
            // Eメールアドレスが未指定の場合はNGとする。
            RuleFor(user => user.EmailAddress).NotNull().NotEmpty().WithMessage("webhookUrl is null or empty");
        }
    }
}