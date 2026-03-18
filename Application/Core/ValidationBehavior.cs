using FluentValidation; // Imports FluentValidation types, including IValidator<T> and ValidationException
using MediatR; // Imports MediatR interfaces, including IPipelineBehavior and request delegates

namespace Application.Core
{
    // Defines a generic class that works for any MediatR request/response pair
    // TRequest = The incoming request type (command/query)
    // TResponse = The Handler's return type
    // (IValidator<TRequest>? validator = null) = Primary Constructor that injects an optional validator for the request type
    public class ValidationBehavior<TRequest, TResponse>(IValidator<TRequest>? validator = null)
        : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull // Interface implementation
    {
        // This method is called automatically by MediatR for every request
        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            // If no validator was registered for this request type, skip validation and continue to the next pipeline step (the handler).
            if (validator == null) return await next();

            // Validates the FluentValidation rules asynchronously against the request
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            // If validation failed, stop processing and throw an exception containing all validation errors. The handler will not execute.
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            // Validation succeeded — continue to the next pipeline step (the handler)
            return await next();
        }
    }
}